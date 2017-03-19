/**
 * This function will take in a HTML element and search for UML diagrams to draw,
 * labeled by the pre tags and class attributes named after the specific kind of diagrams
 * or library. E.g. sequence - sequence diagrams, flow - flowcharts, mermaid for
 * using the mermaid library to draw diagrams, and graphviz for using the graphviz library
 * to draw the diagrams.
 * @param {Element} ele - HTML element containing data parsed and rendered by markdown-it
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

  // Draws all the sequence diagrams found
  for (let i = 0; i < seqDiagrams.length; i+=1) {
    /* eslint no-loop-func: 0 */
    promiseArr.push(new Promise((resolve, reject) => {
      const observer = new MutationObserver((mutations) => {
        if (mutations.length !== 0) {
          observer.disconnect();
          resolve(seqDiagrams[i].innerHTML);
        }
      });

      let content = seqDiagrams[i].innerHTML;
      /* eslint no-useless-escape: 0*/
      content = content.replace(/\&gt\;/g, '>');
      seqDiagrams[i].innerHTML = '';
      /* eslint no-undef: 0 */
      const diagram = Diagram.parse(content);
      observer.observe(seqDiagrams[i], observerConfig);
      diagram.drawSVG(seqDiagrams[i], { theme: 'simple' });
    }));
  }

  // Draws all the flowcharts found
  for (let i = 0; i < flowCharts.length; i+=1) {
    /* eslint no-loop-func: 0 */
    promiseArr.push(new Promise((resolve, reject) => {
      const observer = new MutationObserver((mutations) => {
        if (mutations.length !== 0) {
          observer.disconnect();
          resolve('Finished drawing!');
        }
      });

      let content = flowCharts[i].innerHTML;
      /* eslint no-useless-escape: 0*/
      content = content.replace(/\&gt\;/g, '>');
      flowCharts[i].innerHTML = '';
      /* eslint no-undef: 0 */
      const diagram = flowchart.parse(content);
      observer.observe(flowCharts[i], observerConfig);
      diagram.drawSVG(flowCharts[i]);
    }));
  }

  // Draws all the graphviz diagrams found
  for (let i = 0; i < graphviz.length; i+=1) {
    let content = graphviz[i].innerHTML;
    /* eslint no-useless-escape: 0*/
    content = content.replace(/\&gt\;/g, '>');
    /* eslint no-undef: 0 */
    graphviz[i].innerHTML = Viz(content);
  }

  // Draws all the mermaid diagrams found
  if (mermaidDiagrams.length !== 0) {
    mermaidAPI.initialize({ startOnLoad: false });
  }
  for (let i = 0; i < mermaidDiagrams.length; i+=1) {
    // Setting id for mermaidAPI to find correct element
    mermaidDiagrams.id = `mermaidChart${i}`;
    let content = mermaidDiagrams[i].innerHTML;
    /* eslint no-useless-escape: 0*/
    content = content.replace(/\&gt\;/g, '>');
    /* eslint no-undef: 0 */
    if (window.mermaidAPI.parse(content)) {
      const cb = (html) => {
        mermaidDiagrams[i].innerHTML = html;
      };
      mermaidAPI.render(`mermaidChart${i}`, content, cb);
    } else {
      throw (error);
    }
  }

  // returns resolved if all the promises are resolved, otherwise returns rejected
  return Promise.all(promiseArr).then(() => seqDiagrams);
}
