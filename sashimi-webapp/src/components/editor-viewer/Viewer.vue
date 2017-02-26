<template>
  <div class="viewer" v-bind:data-viewmode='viewMode'>
    <div v-if="viewMode === 'pages' || viewMode === 'slides'">
      <div id='viewer-container'></div>
    </div>
    <div v-else>
      <div id="viewer-container" v-html="getHtmlData">
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import AsyncComputed from 'vue-async-computed';
  import _ from 'lodash';
  import documentPackager from 'src/logic/documentPackager';
  import urlHelper from 'src/helpers/url';
  import pdfjsRenderer from 'src/helpers/pdfjsRenderer';

  Vue.use(AsyncComputed);
  const throttleTime = 500;

  // getParameterByName is used to obtain the query string form the url.
  // Currently the viewMode is being obtained via query string:
  // ?viewMode=pages
  // TOOD: In release, the viewMode should be passed down from the parent instead.

  const renderPdfToDom = ((pdfBase64) => {
    pdfjsRenderer.renderCanvasView(pdfBase64, 'viewer-container');
  });

  const updateViewer = ((vueComponent) => {
    if (vueComponent.viewMode === 'pages') {
      vueComponent.pagesRenderThrottleFn(vueComponent.editorContent);
    } else if (vueComponent.viewMode === 'slides') {
      vueComponent.slidesRenderThrottleFn(vueComponent.editorContent);
    }
  });

  export default {
    props: ['editorContent'],
    data() {
      return {
        viewMode: '',
        pagesRenderThrottleFn: _.throttle((markdownString) => {
          documentPackager.getPagesData(markdownString)
          .then(renderPdfToDom);
        }, throttleTime),
        slidesRenderThrottleFn: _.throttle((markdownString) => {
          documentPackager.getSlidesData(markdownString)
          .then(renderPdfToDom);
        }, throttleTime),
      };
    },
    watch: {
      editorContent() {
        updateViewer(this);
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
      updateViewer(this);
    }
  };

</script>

<style lang="scss">
  @import '../../assets/styles/variables.scss';

  .viewer {
    height: calc(100vh - #{$navbar-height});
    overflow-wrap: break-word;
    overflow-y: scroll;
    box-sizing: border-box;
    line-height: 1.6em;
    position: relative;
    padding: 20px 50px;

    p {
      margin-top: 7px;
    }
  }

  .viewer[data-viewmode="slides"],
  .viewer[data-viewmode="pages"] {
    background-color: #FAFAFA;
    padding: 0;

    .page {
      box-shadow: 1px 1px 4px 1px rgba(0,0,0,0.3);
      margin: 32px;

      canvas {
        width: 100%;
      }
    }
  }
</style>
