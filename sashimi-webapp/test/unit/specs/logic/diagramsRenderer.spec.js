import diagramsRenderer from 'src/logic/renderer/diagrams';
import documentPackager from 'src/logic/documentPackager';
import diagramsInput from './reference/diagrams/diagramsInput.txt';
import seqDiagramsInput from './reference/diagrams/seqDiagramsInput.txt';
import seqDiagramsOutput from './reference/diagrams/seqDiagramsOutput.txt';
import flowChartsInput from './reference/diagrams/flowChartsInput.txt';
import flowChartsOutput from './reference/diagrams/flowChartsOutput.txt';
import graphvizInput from './reference/diagrams/graphvizInput.txt';
import graphvizOutput from './reference/diagrams/graphvizOutput.txt';
import mermaidInput from './reference/diagrams/mermaidInput.txt';
import mermaidOutput from './reference/diagrams/mermaidOutput.txt';
import diagramsRenderedOutput from './reference/diagrams/diagramsRenderedOutput.txt';

// Parse markdown content for test use
const fullHtmlData = documentPackager.getHtmlData(diagramsInput);
const seqHtmlData = documentPackager.getHtmlData(seqDiagramsInput);
const flowHtmlData = documentPackager.getHtmlData(flowChartsInput);
const vizHtmlData = documentPackager.getHtmlData(graphvizInput);
const mermaidHtmlData = documentPackager.getHtmlData(mermaidInput);

// Use iframe as a psuedo browser for testing
const iframe = document.createElement('IFRAME');
let iframeDoc;
let toRender;

describe('Renderer', () => {
  before(() => {
    document.body.appendChild(iframe);
    iframe.onload = function() {
      iframeDoc = iframe.contentWindow.document;
      iframeDoc.write('<div></div>');
    };
    iframe.onload();
    console.log(iframeDoc.width, iframeDoc.height);
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

    it('should handle drawing of sequence diagrams', (done) => {
      // Retrieve HTML string from getHtmlData
      seqHtmlData.then((output) => {
        console.log(iframeDoc.width, iframeDoc.height);
        toRender.innerHTML = output;
        diagramsRenderer(toRender)
        .then((out) => {
          const renderedContent = toRender.innerHTML.replace(/&quot;/g, '\'');
          const outputContent = seqDiagramsOutput.replace(/(\r\n)/g, '\n');
          expect(renderedContent).to.equal(outputContent);
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
      flowHtmlData.then((output) => {
        toRender.innerHTML = output;
        diagramsRenderer(toRender)
        .then((out) => {
          // We are comparing length because the draw function (using Raphaël) will input a different id value for
          // certain tags on different calls, but content length will always be the same.
          let renderedContent = toRender.innerHTML.replace(/&gt;/g, '>');
          renderedContent = renderedContent.replace(/&quot;/g, '"');
          const outputContent = flowChartsOutput.replace(/(\r\n)/g, '\n');
          expect(renderedContent.length).to.equal(outputContent.length);
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
      vizHtmlData.then((output) => {
        toRender.innerHTML = output;
        diagramsRenderer(toRender)
        .then((out) => {
          const renderedContent = toRender.innerHTML.replace(/&gt;/g, '>');
          const outputContent = graphvizOutput.replace(/(\r\n)/g, '\n');
          expect(renderedContent).to.equal(outputContent);
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
      mermaidHtmlData.then((output) => {
        toRender.innerHTML = output;
        diagramsRenderer(toRender)
        .then((out) => {
          const renderedContent = toRender.innerHTML.replace(/&gt;/g, '>');
          const outputContent = mermaidOutput.replace(/(\r\n)/g, '\n');
          // We are comparing length here also because mermaid diagrams being drawn cannot compare directly due to mermaidAPI
          // setting custom numbered/tagged attribute values on different runs of the test, however content length will always be the same.
          // e.g. 1st run: <text dy="1em" y="3" x="0" fill="#000" stroke="none" font-size="10" style="text-anchor: middle;">
          // 2nd run could be: y attribute value can be 4 instead of 3 etc
          expect(renderedContent.length).to.equal(outputContent.length);
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
      fullHtmlData.then((output) => {
        toRender.innerHTML = output;
        diagramsRenderer(toRender)
        .then((out) => {
          // Replace special characters that have been converted into ampersands
          let renderedContent = toRender.innerHTML.replace(/&gt;/g, '>');
          renderedContent = renderedContent.replace(/(\\')/g, '\'');
          renderedContent = renderedContent.replace(/&quot;/g, '"');
          renderedContent = renderedContent.replace(/&#45;/g, '-');
          let outputContent = diagramsRenderedOutput.replace(/(\r\n)/g, '\n');
          outputContent = outputContent.replace(/\\'/g, '\'');
          outputContent = outputContent.replace(/&quot;/g, '"');
          outputContent = outputContent.replace(/&#45;/g, '-');
          // We are comparing length here again because flowCharts being drawn cannot compare directly because the draw function (using Raphaël)
          // will input a different id value for certain tags on different calls, but content length will always be the same.
          expect(renderedContent.length).to.equal(outputContent.length);
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
  });
});
