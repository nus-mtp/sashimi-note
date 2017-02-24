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
  import documentPackager from 'src/logic/documentPackager';
  import PDFJS from 'pdfjs-dist';
  import urlHelper from 'src/helpers/url';

  Vue.use(AsyncComputed);
  PDFJS.PDFJS.workerSrc = '/pdf.worker.js';

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
            renderPdfCanvasViewerToDom(pdfBase64, 'viewer-pages-container');
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

      // Clear existing pages
      container.innerHTML = '';

      // Loop from 1 to total_number_of_pages in PDF document
      for (let i = 1; i <= pdfDocument.numPages; i += 1) {
        // Get desired page
        pdfDocument.getPage(i).then((page) => {
          const scale = 2;
          const viewport = page.getViewport(scale);
          const div = document.createElement('div');

          // Set id attribute with page-#{pdf_page_number} format
          div.setAttribute('id', `${domId}-page-${page.pageIndex + 1}`);

          // This will keep positions of child elements as per our needs
          div.setAttribute('class', 'page');

          // Append div within div#container
          container.appendChild(div);

          // Create a new Canvas element
          const canvas = document.createElement('canvas');
          canvas.setAttribute('style', 'width: 100%');

          // Append Canvas within div#page-#{pdf_page_number}
          div.appendChild(canvas);

          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

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

<style scoped lang='scss'>
  @import '../../assets/styles/variables.scss';
  
  .viewer {
    height: calc(100vh - #{$navbar-height});
    overflow-wrap: break-word;
    overflow-y: scroll;
    box-sizing: border-box;
    margin-left: 10px;
    line-height: 1.6em;

    p {
      margin-top: 7px;
    }
  }
</style>
