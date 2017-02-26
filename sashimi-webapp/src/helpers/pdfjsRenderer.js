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
        width: calc(18.6cm + 16px);
        position: absolute;
        top: 0;
        left: -99999px;
        transform: scale(0.75);
        overflow-y: hidden;
        right: 0;
      `);
      renderSandbox.src = 'about:blank';
      document.body.appendChild(renderSandbox);
    }

    // Render sourceHtml into the sandbox
    const sandboxDoc = renderSandbox.contentWindow.document;

    sandboxDoc.open();
    sandboxDoc.write(sourceHtml);
    sandboxDoc.close();

    // Retrieve all element node from sandbox
    const styleBlock = document.createElement('style');
    styleBlock.innerHTML = `
* {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;
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
`; sandboxDoc.childNodes[0].childNodes[0].appendChild(styleBlock);

    const domList = sandboxDoc.childNodes[0].childNodes[1].childNodes;
    const domArray = Object.keys(sandboxDoc.childNodes[0].childNodes[1].childNodes)
                           .map(key => domList[key])
                           .filter(node => node.nodeName !== '#text');
    console.log(domArray);
    const domHeightList = domArray.map(node => node.offsetHeight || 0);

    // Structure all element node into target view
    const contentHeightInCm = parseFloat(targetInfo.page.height, 10) -
                             (parseFloat(targetInfo.page.padding.top, 10) +
                              parseFloat(targetInfo.page.padding.bottom, 10));
    const contentHeight = parseFloat(unitConverter.get(`${contentHeightInCm}cm`, 'px'), 10);

    /* eslint no-var: 0 */
    /* eslint vars-on-top: 0 */
    var pagesArray = [];
    var pageArray = [];
    let cummulativePageHeight = 0;
    domArray.forEach((node, index) => {
      const elementHeight = domHeightList[index];
      const prospectiveCummulativeHeight = cummulativePageHeight + elementHeight;
      console.log('prospectiveCummulativeHeight', prospectiveCummulativeHeight);

      // If this node cannot fit inside the existing page
      if (prospectiveCummulativeHeight > contentHeight) {
        console.log('cannot fit in page');
        // If this element is larger than the page
        if ((contentHeight / elementHeight) > 1) {
          console.log('element is larget than page');
          // If it is currently at the beginning of the page
          if (cummulativePageHeight === 0) {
            console.log('element is at beginning');
          // Else it is at the middle of the page
          } else {
            console.log('element is at the middle');
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
          console.log('element is smaller than page');

          // > create a new page
          pagesArray.push(pageArray);
          pageArray = [];
          cummulativePageHeight = 0;
          // > then insert in the page
          pageArray.push(node);
          cummulativePageHeight = prospectiveCummulativeHeight;
        }

      // else this node can fit inside the existing page
      } else {
        console.log('element can fit inside');
        pageArray.push(node);
        cummulativePageHeight = prospectiveCummulativeHeight;
        console.log(cummulativePageHeight, contentHeight);
      }
    });
    if (pageArray.length > 0) {
      pagesArray.push(pageArray);
      pageArray = [];
    }
    console.log(domArray, domHeightList, pagesArray);

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
