<template>
  <div class="viewer">
    <div v-if="viewMode === 'pages'">
      <div id="viewer-pages">
        <div id='viewer-pages-container'></div>
      </div>
    </div>
    <div v-else-if="viewMode === 'slides'">
      <div id="viewer-slides" v-html="getHtmlData">
      </div>
    </div>
    <div v-else>
      <div id="viewer-html" v-html="getHtmlData">
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import AsyncComputed from 'vue-async-computed';
  import PDFJS from 'pdfjs-dist';
  import _ from 'lodash';
  import documentPackager from 'src/logic/documentPackager';
  import urlHelper from 'src/helpers/url';

  Vue.use(AsyncComputed);
  PDFJS.PDFJS.workerSrc = '/static/workers/pdf.worker.js';

  const throttledPdfRendering = _.debounce(renderPdfCanvasViewerToDom, 600);

  // getParameterByName is used to obtain the query string form the url.
  // Currently the viewMode is being obtained via query string:
  // ?viewMode=pages
  // TOOD: In release, the viewMode should be passed down from the parent instead.
  
  export default {
    props: ['editorContent'],
    data() {
      return {
        viewMode: '',
      };
    },
    watch: {
      editorContent(value) {
        if (this.viewMode === 'pages') {
          /* eslint no-use-before-define: 0*/
          documentPackager.getPagesData(this.editorContent)
          .then((pdfBase64) => {
            throttledPdfRendering(pdfBase64, 'viewer-pages-container');
          });
        }
      }
    },
    asyncComputed: {
      getHtmlData() {
        return documentPackager.getHtmlData(this.editorContent);
      }
    },
    mounted() {
      // TODO: get viewMode from prop during release
      this.viewMode = urlHelper.getParameterByName('viewMode') || 'html';
    }
  };

  /**
  * Render a jsPDF object into the DOM
  * @param {jsPDFOutput} jsPDFOutput
  * @param {string} document ID where the pages should be rendered
  * Function referenced from:
  *   https://www.sitepoint.com/custom-pdf-rendering/
  */
  function renderPdfCanvasViewerToDom(pdfBase64, domId) {
    PDFJS.getDocument(pdfBase64)
    .then((pdfDocument) => {
      // Get div#container and cache it for later use
      const container = document.getElementById(domId);
      const totalPages = pdfDocument.numPages;

      // Loop from 1 to total_number_of_pages in PDF document
      for (let i = 1; i <= totalPages; i += 1) {
        // Get desired page
        pdfDocument.getPage(i).then((page) => {
          const scale = 1;
          const viewport = page.getViewport(scale);

          // Check if existing page exist
          const currentPageId = `${domId}-page-${page.pageIndex + 1}`;
          let currentPage = document.getElementById(currentPageId);
          let canvas = null;

          if (!currentPage) {
            // create a new page node
            currentPage = document.createElement('div');
            currentPage.setAttribute('id', currentPageId);
            currentPage.setAttribute('class', 'page');
            container.appendChild(currentPage);

            // create a canvas node
            canvas = document.createElement('canvas');
            currentPage.appendChild(canvas);

            canvas.height = viewport.height;
            canvas.width = viewport.width;
          } else {
            canvas = currentPage.firstChild;
          }

          const context = canvas.getContext('2d');
          const renderContext = {
            canvasContext: context,
            viewport
          };

          // Render PDF page
          page.render(renderContext);
        });
      }
    });
  }
</script>

<style lang='scss'>
  @import '../../assets/styles/variables.scss';
  
  .viewer {
    height: calc(100vh - #{$navbar-height});
    overflow-wrap: break-word;
    overflow-y: scroll;
    box-sizing: border-box;
    margin-left: 10px;
    line-height: 1.6em;
    position: relative;

    p {
      margin-top: 7px;
    }
  }

  #viewer-pages {
    position: absolute;
    top: 0;
    background-color: #FAFAFA;
  }
  #viewer-pages-container .page {
    box-shadow: 1px 1px 4px 1px rgba(0,0,0,0.3);
    margin: 32px;

    canvas {
      width: 100%;
    }
  }
</style>
