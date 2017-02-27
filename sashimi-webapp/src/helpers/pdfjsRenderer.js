import PDFJS from 'pdfjs-dist';
import unitConverter from 'src/helpers/unitConverter';

/**
 * Initialise PDF js's web worker.
 * This initialisation should be done only once
 *   when it is imported by a module.
 * Subsequent module import should not reinitialise the worker path.
 * By default, webpack module loader will cache this module.
 *   The functions will only be executed once
 */
(function initialiseWorkerPath() {
  const pdfJsWorkerPath = '/static/workers/pdf.worker.js';

  if (PDFJS.PDFJS.workerSrc !== pdfJsWorkerPath) {
    PDFJS.PDFJS.workerSrc = pdfJsWorkerPath;
  }
}());


export default {


  renderView(sourceHtml, targetDomId) {
    // Get render target container
    const container = document.getElementById(targetDomId);
    if (!container) {
      throw new ReferenceError(`Cannot find element with id: "${targetDomId}". `);
    }

    const targetInfo = {
      page: {
        width: '21cm',
        height: '29.7cm',
        padding: {
          top: '1.2cm',
          bottom: '1.2cm',
          right: '1.2cm',
          left: '1.2cm'
        }
      }
    };

    // Get rendering sandbox
    const renderSandboxId = 'sashimi-note-render-sandbox';

    // Retrieve existing sandbox renderer
    let renderSandbox = document.getElementById(renderSandboxId);

    if (!renderSandbox) { // Create a new sandbox if not found
      renderSandbox = document.createElement('iframe');
      renderSandbox.setAttribute('id', renderSandboxId);
      renderSandbox.setAttribute('scrolling', 'no');
      renderSandbox.setAttribute('style', `
        width: ${targetInfo.page.width};
        position: absolute;
        top: 0;
        left: -99999px;
        transform: scale(0.75);
        overflow-y: hidden;
      `);
      renderSandbox.src = 'about:blank';
      document.body.appendChild(renderSandbox);
    }

    const sandboxDoc = renderSandbox.contentWindow.document;

    let renderSandboxStyleBlock = sandboxDoc.getElementById(`${renderSandboxId}-style`);
    if (!renderSandboxStyleBlock) {
      // Add styling to the iframe
      renderSandboxStyleBlock = document.createElement('style');
      renderSandboxStyleBlock.setAttribute('id', `${renderSandboxId}-style`);
      renderSandboxStyleBlock.innerHTML = `
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;
  padding-left: ${targetInfo.page.padding.left};
  padding-right: ${targetInfo.page.padding.right};
  box-sizing: border-box;
}
h1 {
  font-size: 2em;
  margin: 0.67em 0;
}
p {
  margin-top: 7px;
  display: block;
  -webkit-margin-before: 1em;
  -webkit-margin-after: 1em;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
  overflow-wrap: break-word;
  line-height: 1.6em;
  font-size: 18px;
}
p img {
  width: 100%;
}`;
      sandboxDoc.childNodes[0].childNodes[0].appendChild(renderSandboxStyleBlock);
    }


    // Render sourceHtml into the sandbox
    const sandboxDocBody = sandboxDoc.childNodes[0].childNodes[1];
    sandboxDocBody.innerHTML = sourceHtml;

    setTimeout(() => {
      // Retrieve all element node from sandbox
      const domList = sandboxDocBody.childNodes;
      const domArray = Object.keys(sandboxDoc.childNodes[0].childNodes[1].childNodes)
                            .map(key => domList[key])
                            .filter(node => node.nodeName !== '#text');
      const domHeightList = domArray.map((node) => {
        const nodeStyle = node.currentStyle || renderSandbox.contentWindow.getComputedStyle(node);

        const resultantHeight = Math.max(node.offsetHeight, Number.parseFloat(nodeStyle.height, 10));

        console.log(node.offsetHeight, nodeStyle.height, nodeStyle.marginTop, nodeStyle.marginBottom);
        return resultantHeight +
              Number.parseFloat(nodeStyle.marginTop, 10) +
              Number.parseFloat(nodeStyle.marginBottom, 10);
      });

      // Structure all element node into target view
      const contentHeightInCm = parseFloat(targetInfo.page.height, 10) -
                              (parseFloat(targetInfo.page.padding.top, 10) +
                                parseFloat(targetInfo.page.padding.bottom, 10));
      const heightError = 0;
      const contentHeight = parseFloat(unitConverter.get(`${contentHeightInCm}cm`, 'px'), 10) - heightError;

      /* eslint no-var: 0 */
      /* eslint vars-on-top: 0 */
      var pagesArray = [];
      var pageArray = [];
      let cummulativePageHeight = 0;
      domArray.forEach((node, index) => {
        const elementHeight = domHeightList[index];
        const prospectiveCummulativeHeight = cummulativePageHeight + elementHeight;

        // If this node cannot fit inside the existing page
        if (prospectiveCummulativeHeight > contentHeight) {
          console.log(`${index} | ${elementHeight}|${cummulativePageHeight}/${parseInt(contentHeight, 10)} cannot fit in page`, node);
          // If this element is larger than the page
          if ((elementHeight / contentHeight) > 1) {
            console.log(`${index} | ${elementHeight}|${cummulativePageHeight}/${parseInt(contentHeight, 10)} is larget than page`, node);
            // If it is currently at the beginning of the page
            if (cummulativePageHeight === 0) {
              console.log(`${index} | ${elementHeight}|${cummulativePageHeight}/${parseInt(contentHeight, 10)} is at beginning`, node);
            // Else it is at the middle of the page
            } else {
              console.log(`${index} | ${elementHeight}|${cummulativePageHeight}/${parseInt(contentHeight, 10)} is at the middle`, node);
              // > create a new page
              pagesArray.push(pageArray);
              pageArray = [];
              cummulativePageHeight = 0;
            }
            // > then just insert in the page
            pageArray.push(node);
            // > create a new page
            pagesArray.push(pageArray);
            pageArray = [];
            cummulativePageHeight = 0;

          // Else this element is smaller than the page
          } else {
            console.log(`${index} | ${elementHeight}|${cummulativePageHeight}/${parseInt(contentHeight, 10)} is smaller than page`, node);

            // > create a new page
            pagesArray.push(pageArray);
            pageArray = [];
            cummulativePageHeight = 0;
            // > then insert in the page
            pageArray.push(node);
            cummulativePageHeight = elementHeight;
          }

        // else this node can fit inside the existing page
        } else {
          console.log(`${index} | ${elementHeight}|${cummulativePageHeight}/${parseInt(contentHeight, 10)} can fit inside`, node);
          pageArray.push(node);
          cummulativePageHeight = prospectiveCummulativeHeight;
        }
      });
      if (pageArray.length > 0) {
        pagesArray.push(pageArray);
        pageArray = [];
      }

      // Generate HTML string
      const pageContainer = document.createElement('div');

      pagesArray.forEach((page, pageNumber) => {
        const pageView = document.createElement('div');
        pageView.setAttribute('class', 'page-view');
        page.forEach((pageNode) => {
          pageView.appendChild(pageNode.cloneNode(true));
        });
        pageContainer.appendChild(pageView);
      });

      container.innerHTML = '<div></div>';
      container.appendChild(pageContainer);
    }, 1000);
  },

  /**
  * Render a jsPDF object into the DOM
  * @param {jsPDFOutput} jsPDFOutput
  * @param {string} document ID where the pages should be rendered
  * Function referenced from:
  *   https://www.sitepoint.com/custom-pdf-rendering/
  */
  renderCanvasView(pdfBase64, domId) {
    PDFJS.getDocument(pdfBase64)
    .then((pdfDocument) => {
      const totalPages = pdfDocument.numPages;
      const viewportScale = 2;

      // Get div#container and cache it for later use
      const container = document.getElementById(domId);
      if (!container) {
        throw new ReferenceError(`Cannot find element with id: "${domId}". `);
      }

      // Loop from 1 to total_number_of_pages in PDF document
      for (let i = 1; i <= totalPages; i += 1) {
        // Get desired page
        pdfDocument.getPage(i).then((page) => {
          const viewport = page.getViewport(viewportScale);

          // Check if existing page exist
          const currentPageId = `${domId}-page-${page.pageIndex + 1}`;
          let currentPage = document.getElementById(currentPageId);
          let canvas = null;

          if (!currentPage) {
            // if the page doesn't exist, create a new page node
            currentPage = document.createElement('div');
            currentPage.setAttribute('id', currentPageId);
            currentPage.setAttribute('class', 'page');
            container.appendChild(currentPage);

            // create and attach a canvas to the page node
            canvas = document.createElement('canvas');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            currentPage.appendChild(canvas);
          } else {
            // else, reuse the existing canvas
            canvas = currentPage.firstChild;
          }

          // Render PDF page on the canvas
          page.render({
            canvasContext: canvas.getContext('2d'),
            viewport
          });
        });
      }

      // Clean up excessive pages
      let numOfExistingPage = container.childNodes.length;

      while (totalPages < numOfExistingPage) {
        container.childNodes[container.childNodes.length - 1].remove();
        numOfExistingPage = container.childNodes.length;
      }
    });
  }
};
