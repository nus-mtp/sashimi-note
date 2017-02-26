import PDFJS from 'pdfjs-dist';

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
