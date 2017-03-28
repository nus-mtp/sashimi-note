/**
 * This function will take in a HTML element and search for UML diagrams to draw,
 * labeled by the pre tags and class attributes named after the specific kind of diagrams
 * or library. E.g. sequence - sequence diagrams, flow - flowcharts, mermaid for
 * using the mermaid library to draw diagrams, and graphviz for using the graphviz library
 * to draw the diagrams.
 * @param {Element} ele - HTML element/node containing data parsed and rendered by markdown-it
 * @return {Promise<string, error>} Promise - containing the HTML string with rendered diagrams
 */

export default function diagramsRenderer(ele) {
  const observerConfig = { childList: true };
  // get all pre tags with class name = sequence
  const seqDiagrams = ele.querySelectorAll('pre.sequence');
  // get all pre tags with class name = flow
  const flowCharts = ele.querySelectorAll('pre.flow');
  // get all pre tags with class name = graphviz
  const graphviz = ele.querySelectorAll('pre.graphviz');
  // get all pre tags with class name = mermaid
  const mermaidDiagrams = ele.querySelectorAll('pre.mermaid');
  // array of promises for use by Promise.all
  const promiseArr = [];

  // Eslint escapes
  /* eslint no-loop-func: 0 */
  /* eslint no-undef: 0 */

  // Draws all the sequence diagrams found
  for (let i = 0; i < seqDiagrams.length; i+=1) {
    promiseArr.push(new Promise((resolve, reject) => {
      const observer = new MutationObserver((mutations) => {
        if (mutations.length !== 0) {
          observer.disconnect();
          resolve('Finished drawing!');
        }
      });
      let content = seqDiagrams[i].innerHTML;
      content = content.replace(/&gt;/g, '>');
      const diagram = Diagram.parse(content);
      seqDiagrams[i].innerHTML = '';
      observer.observe(seqDiagrams[i], observerConfig);
      diagram.drawSVG(seqDiagrams[i], { theme: 'simple' });
    }).catch((error) => {
      seqDiagrams[i].innerHTML = `<code class='hljs'>${seqDiagrams[i].innerHTML}</code>`;
    }));
  }

  // Draws all the flowcharts found
  for (let i = 0; i < flowCharts.length; i+=1) {
    promiseArr.push(new Promise((resolve, reject) => {
      const observer = new MutationObserver((mutations) => {
        if (mutations.length !== 0) {
          observer.disconnect();
          resolve('Finished drawing!');
        }
      });

      let content = flowCharts[i].innerHTML;
      content = content.replace(/&gt;/g, '>');
      const diagram = flowchart.parse(content);
      flowCharts[i].innerHTML = '';
      observer.observe(flowCharts[i], observerConfig);
      diagram.drawSVG(flowCharts[i]);
    })
    .catch((error) => {
      if (flowCharts[i].innerHTML !== '') {
        flowCharts[i].innerHTML = `<code class='hljs'>${flowCharts[i].innerHTML}</code>`;
      }
    }));
  }

  // Draws all the graphviz diagrams found
  for (let i = 0; i < graphviz.length; i+=1) {
    let content = graphviz[i].innerHTML;
    content = content.replace(/&gt;/g, '>');
    try {
      graphviz[i].innerHTML = Viz(content);
    } catch (error) {
      graphviz[i].innerHTML = `<code class='hljs'>${graphviz[i].innerHTML}</code>`;
    }
  }

  // Draws all the mermaid diagrams found
  if (mermaidDiagrams.length !== 0) {
    mermaidAPI.initialize({ startOnLoad: false });
  }
  for (let i = 0; i < mermaidDiagrams.length; i+=1) {
    let content = mermaidDiagrams[i].innerHTML;
    content = content.replace(/&gt;/g, '>');
    if (window.mermaidAPI.parse(content)) {
      const cb = (html, bindFunc) => {
        mermaidDiagrams[i].innerHTML = html;
      };
      mermaidAPI.render(`mermaidChart${i}`, content, cb);
    } else {
      mermaidDiagrams[i].innerHTML = `<code class='hljs'>${mermaidDiagrams[i].innerHTML}</code>`;
    }
  }

  // returns resolved if all the promises are resolved, otherwise returns rejected
  return Promise.all(promiseArr);
}
