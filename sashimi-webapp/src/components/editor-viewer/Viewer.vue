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
  import _ from 'lodash';
  import documentPackager from 'src/logic/documentPackager';
  import urlHelper from 'src/helpers/url';
  import pdfjsRenderer from 'src/helpers/pdfjsRenderer';

  Vue.use(AsyncComputed);

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
      editorContent: _.throttle((markdownString) => {
        documentPackager.getPagesData(markdownString)
        .then((pdfBase64) => {
          pdfjsRenderer.renderCanvasView(pdfBase64, 'viewer-pages-container');
        });
      }, 1200)
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

</script>

<style lang="scss">
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
