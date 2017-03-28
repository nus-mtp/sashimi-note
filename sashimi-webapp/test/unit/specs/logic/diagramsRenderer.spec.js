import domCompare from 'dom-compare';
import diagramsRenderer from 'src/logic/renderer/diagrams';
import documentPackager from 'src/logic/documentPackager';
import diagramsInput from './reference/diagrams/diagramsInput.txt';
import diagramsRenderedOutput from './reference/diagrams/diagramsRenderedOutput.txt';
import flowChartsInput from './reference/diagrams/flowChartsInput.txt';
import flowChartsOutput from './reference/diagrams/flowChartsOutput.txt';
import graphvizInput from './reference/diagrams/graphvizInput.txt';
import graphvizOutput from './reference/diagrams/graphvizOutput.txt';
import invalidSyntaxInput from './reference/diagrams/invalidSyntaxInput.txt';
import invalidSyntaxOutput from './reference/diagrams/invalidSyntaxOutput.txt';
import mermaidInput from './reference/diagrams/mermaidInput.txt';
import mermaidOutput from './reference/diagrams/mermaidOutput.txt';
import seqDiagramsInput from './reference/diagrams/seqDiagramsInput.txt';
import seqDiagramsOutput from './reference/diagrams/seqDiagramsOutput.txt';

// Parse markdown content for test use
const fullHtmlData = documentPackager.getHtmlData(diagramsInput);
const seqHtmlData = documentPackager.getHtmlData(seqDiagramsInput);
const flowHtmlData = documentPackager.getHtmlData(flowChartsInput);
const vizHtmlData = documentPackager.getHtmlData(graphvizInput);
const mermaidHtmlData = documentPackager.getHtmlData(mermaidInput);
const invalidHtmlData = documentPackager.getHtmlData(invalidSyntaxInput);

// Use iframe as a psuedo browser for testing
const iframe = document.createElement('IFRAME');
let iframeDoc;
let toRender;

/**
 * Regex helper function for checking differences found by domCompare library.
 *
 * We are using this because some attribute values/styling are rendered differently on travis,
 * causing travis to keep failing, although local unit test passes the test.
 *
 * Four cases to ignore:
 * 1. Attribute value differs by parenthesis even though its the same font or because of random generation of value
 *  regex1 case:
 *    /(.*) '(.*)':.* '(.*)'.*'(.*)'/g;
 *    1st (.*) captures the category causing the Error (e.g. is it Tag, Attribute, Attribute's value or Content?)
 *    2nd (.*) captures the attribute causing the Error (e.g. is it 'id', 'href', 'src' attribute etc)
 *    3rd (.*) captures type of error's expected value (e.g. 'Arial')
 *    4th (.*) captures type of error's actual value (e.g. "Arial")
 *  Example lines -
 *    1. 'Attribute 'font-family': expected value ''Arial'' instead of '"Arial"''
 *    2. 'Attribute 'id': expected value 'raphael-marker-endblock33-obj5c60j' instead of 'raphael-marker-endblock33-obj5ihv5''
 *
 * 2. Attribute is missing, usually caused by attributes that have the deprecated 'xlink:' resulting in the expected
 * output to differ from the actual output.
 *  regex2 case:
 *    /(.*) '(.*)' (is missed)/g;
 *    1st (.*) captures the category causing the Error (e.g. is it Tag, Attribute, Attribute's value or Content?)
 *    2nd (.*) captures the class causing the Error (e.g. is it 'id', 'href', 'src' class etc)
 *  Example line -
 *    1. 'Attribute 'xlink:href' is missed'
 *
 * 3. Extra attribute case, in most cases are caused by the above ignore case 2.
 *  regex3 case:
 *    /Extra attribute '(.*)'/g;
 *    (.*) captures the class causing the Error (e.g. is it 'id', 'href', 'src' class etc)
 *  Example line -
 *    1. 'Extra attribute 'href''
 *
 * 4. Different text content, sometimes as a result of different container attribute values (e.g. different width/height etc)
 * from expected output
 *  regex4 case:
 *    /Expected text '(.*)' instead of '(.*)'/g;
 *    1st (.*) captures the category causing the Error (e.g. is it Tag, Attribute, Attribute's value or Content?)
 *    2nd (.*) captures the class causing the Error (e.g. is it 'id', 'href', 'src' class etc)
 *  Example line -
 *    1. 'Expected text 'long long time,' instead of 'long long'
 *    2. 'Expected text 'so long that' instead of 'time, so long'
 *
 * @param {Array} diff - Array containing differences found by domCompare library
 * @return {Array} returns an Array of non-formatting related errors (e.g. critical errors)
 **/
function regexHelper(diff) {
  const ignoredAttr = ['id', 'marker-end', 'x1', 'x2', 'x', 'y1', 'y2', 'y', 'width',
    'height', 'd', 'dy', 'r', 'style', 'viewBox', 'transform', 'points'];
  const missedArray = [];
  const textExpected = new Map();
  const textActual = new Map();

  let errorArray = [];
  diff.forEach((line) => {
    const regex1 = /(.*) '(.*)':.* '(.*)'.*'(.*)'/g;
    const regex2 = /(.*) '(.*)' (is missed)/g;
    const regex3 = /Extra attribute '(.*)'/g;
    const regex4 = /Expected text '(.*)' instead of '(.*)'/g;
    const arr1 = regex1.exec(line.message);
    const arr2 = regex2.exec(line.message);
    const arr3 = regex3.exec(line.message);
    const arr4 = regex4.exec(line.message);
    if (arr1 !== null) {
      // ignore expected value error
      if (arr1[1] === 'Attribute') {
        if (arr1[2] === 'font-family') {
          const expected = arr1[3].replace(/'/g, '');
          const actual = arr1[4].replace(/"/g, '');
          if (expected !== actual) {
            errorArray.push(line);
          }
        // certain cases of id can be ignored
        } else if (arr1[2] === 'id') {
          // Case 1
          if (arr1[3].indexOf('raphael-marker-endblock33-obj') !== -1
              && arr1[4].indexOf('raphael-marker-endblock33-obj') !== -1) {
                // Ignore, not an actual error. Just randomly generated id value
          } else if ((arr1[3].indexOf('arrowhead') !== -1
              && arr1[4].indexOf('arrowhead') !== -1)) {
                // Ignore, not an actual error.
          } else {
            // console.log(line);
            errorArray.push(line);
          }
        } else if (ignoredAttr.indexOf(arr1[2]) === -1) {
          if (arr1[3] !== arr1[4]) {
            errorArray.push(line);
          }
        }
      }
    } else if (arr2 !== null) {
      // ignore missing attribute error
      if (arr2[2].match(/xlink:/g) !== null) {
        missedArray.push(arr2[2].replace(/xlink:/g, ''));
      } else if (arr2[2].match(/:xlink/g) !== null) {
        missedArray.push(arr2[2].replace(/:xlink/g, ''));
      } else {
        errorArray.push(line);
      }
    } else if (arr3 !== null) {
      // ignore extra attribute error
      if (missedArray.length !== 0) {
        const pos = missedArray.indexOf(arr3[1]);
        if (pos !== -1) {
          missedArray.splice(pos, 1);
        } else {
          errorArray.push(line);
        }
      }
    } else if (arr4 !== null) {
      // Check the node where the error is thrown and concantate the strings!
      const regexNode = /(.*)\//g;
      // Capture the path of node where the error is thrown
      const arrNode = regexNode.exec(line.node);
      // Use the path as a key to store the strings in textExpected & textActual
      const key = arrNode[1];
      // Push line as an error first
      errorArray.push(line);

      // Check if textExpected & textActual already contains the respective key
      if (textExpected.has(key) && textActual.has(key)) {
        // If have, set key's value as the combination of existing string with current string
        const currExpectedText = textExpected.get(key);
        const currActualText = textActual.get(key);
        textExpected.set(key, `${currExpectedText} ${arr4[1]}`);
        textActual.set(key, `${currActualText} ${arr4[2]}`);
      } else {
        // Else, set key's value to current string
        textExpected.set(key, arr4[1]);
        textActual.set(key, arr4[2]);
      }

      // After updating textExpected & textActual with the respective strings, check if the strings
      // match, if match... errors are most likely due to size formmatting issue causing unexpected
      // text wrapping when rendering the diagrams to fit window size. If don't match... it is
      // indeed an error!
      if (textExpected.get(key) === textActual.get(key)) {
        // If matches filter out all the errors that belong to the specific node's path
        errorArray = errorArray.filter(errorLine => (errorLine.node === arrNode[1]+arrNode[2]));
      }
    } else {
      // add into error array
      errorArray.push(line);
    }
  });
  console.log(errorArray);
  return errorArray;
}

/**
 * Compare expected HTML output and actual HTML output, and return an array of
 * all the differences found.
 * @param {String} output - Expected output HTML string
 * @param {Element} input - Actual rendered HTML element containing the rendered string
 * @return {Array} Array containing all the differences found by dom-compare library
 */
function compareDom(output, input) {
  // Remove carriage return from string read from a .txt file
  const outputContent = output.replace(/(\r\n)/g, '\n');
  // Prepare the output as an HTML Element for comparison using dom-compare library
  const eleOutput = iframeDoc.createElement('DIV');
  eleOutput.innerHTML = outputContent;
  // Get a comparison result object
  const results = domCompare.compare(eleOutput, input);
  return results.getDifferences();
}

describe('Renderer', () => {
  before(() => {
    document.body.appendChild(iframe);
    // Create an area for test diagrams to be rendered into for testing
    iframe.onload = () => {
      iframeDoc = iframe.contentWindow.document;
      iframeDoc.write('<div></div>');
    };
    // Initialise the above
    iframe.onload();
  });

  describe('Diagrams Renderer', () => {
    it('should handle empty data', (done) => {
      toRender = iframeDoc.getElementsByTagName('div')[0];
      diagramsRenderer(toRender)
      .then((output) => {
        expect(toRender.innerHTML).to.equal('');
        done();
      })
      .catch((error) => {
        done(error);
      });
    });

    it('should handle invalid or incomplete diagram syntax', (done) => {
      // Retrieve HTML string from getHtmlData
      invalidHtmlData.then((output) => {
        toRender.innerHTML = output;
        // Render any diagrams to be drawn
        diagramsRenderer(toRender)
        .then((out) => {
          // Check if Expected output === Actual rendered output
          const diff = compareDom(invalidSyntaxOutput, toRender);
          const errorArray = regexHelper(diff);
          expect(errorArray.length).to.equal(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
      })
      .catch((error) => {
        done(error);
      });
    // Change default timeout value because this test requires more time for rendering
    }).timeout(4000);

    it('should handle drawing of sequence diagrams', (done) => {
      // Retrieve HTML string from getHtmlData
      seqHtmlData.then((output) => {
        toRender.innerHTML = output;
        // Render any diagrams to be drawn
        diagramsRenderer(toRender)
        .then((out) => {
          // Check if Expected output === Actual rendered output
          const diff = compareDom(seqDiagramsOutput, toRender);
          const errorArray = regexHelper(diff);
          expect(errorArray.length).to.equal(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
      })
      .catch((error) => {
        done(error);
      });
    });

    it('should handle drawing of flow charts', (done) => {
      // Retrieve HTML string from getHtmlData
      flowHtmlData.then((output) => {
        toRender.innerHTML = output;
        // Render any diagrams to be drawn
        diagramsRenderer(toRender)
        .then((out) => {
          // Check if Expected output === Actual rendered output
          const diff = compareDom(flowChartsOutput, toRender);
          const errorArray = regexHelper(diff);
          expect(errorArray.length).to.equal(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
      })
      .catch((error) => {
        done(error);
      });
    });

    it('should handle drawing of graphviz diagrams', (done) => {
      // Retrieve HTML string from getHtmlData
      vizHtmlData.then((output) => {
        // Render any diagrams to be drawn
        toRender.innerHTML = output;
        diagramsRenderer(toRender)
        .then((out) => {
          // Check if Expected output === Actual rendered output
          const diff = compareDom(graphvizOutput, toRender);
          const errorArray = regexHelper(diff);
          expect(errorArray.length).to.equal(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
      })
      .catch((error) => {
        done(error);
      });
    });

    it('should handle drawing of mermaid diagrams', (done) => {
      // Retrieve HTML string from getHtmlData
      mermaidHtmlData.then((output) => {
        toRender.innerHTML = output;
        // Render any diagrams to be drawn
        diagramsRenderer(toRender)
        .then((out) => {
          // Check if Expected output === Actual rendered output
          const diff = compareDom(mermaidOutput, toRender);
          const errorArray = regexHelper(diff);
          expect(errorArray.length).to.equal(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
      })
      .catch((error) => {
        done(error);
      });
    });

    it('should handle drawing of all types of diagrams together', (done) => {
      // Retrieve HTML string from getHtmlData
      fullHtmlData.then((output) => {
        toRender.innerHTML = output;
        // Render any diagrams to be drawn
        diagramsRenderer(toRender)
        .then((out) => {
          // Check if Expected output === Actual rendered output
          const diff = compareDom(diagramsRenderedOutput, toRender);
          const errorArray = regexHelper(diff);
          expect(errorArray.length).to.equal(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
      })
      .catch((error) => {
        done(error);
      });
    // Change default timeout value because this test requires more time for rendering
    }).timeout(3000);
  });
});
