<template>
  <div class="viewer" v-bind:data-fileFormat='fileFormat'>
    <div v-if="fileFormat === 'pages' || fileFormat === 'slides'">
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
  import PageRenderer from 'src/logic/renderer';
  
  Vue.use(AsyncComputed);

  // Declare page renderers instance. These renderer
  // will be initialised when this component is mounted.
  const pageRendererList = {
    slides: null,
    pages: null,
  };

  // Throttle function used to limit the rate which
  // the render function is called
  const throttleTime = 600;
  const renderThrottleFn = _.throttle((markdownString, pageRenderer) => {
    documentPackager.getHtmlData(markdownString)
    .then(htmlString => pageRenderer.write(htmlString));
  }, throttleTime);

  const updateViewer = ((compunent) => {
    const pr = pageRendererList[compunent.fileFormat];
    if (pr) renderThrottleFn(compunent.editorContent, pr);
  });

  export default {
    props: ['editorContent', 'fileFormat'],
    data() {
      return {};
    },
    watch: {
      editorContent() {
        updateViewer(this);
      },
      fileFormat() {
        updateViewer(this);
      }
    },
    asyncComputed: {
      getHtmlData() {
        return documentPackager.getHtmlData(this.editorContent);
      }
    },
    mounted() {
      const PAGE_A6 = {
        width: '14.8cm',
        height: '10.5cm',
        padding: {
          top: '1.2cm',
          bottom: '1.2cm',
          right: '1.2cm',
          left: '1.2cm'
        }
      };

      // Mount does not gurrantee DOM to be ready, thus nextTick is used
      const self = this;
      Vue.nextTick(() => {
        pageRendererList.pages = new PageRenderer('viewer-container');
        pageRendererList.slides = new PageRenderer('viewer-container', PAGE_A6);
        updateViewer(self);
      });
    }
  };

</script>

<style lang='scss'>
  @import 'src/assets/styles/variables.scss';
  @import 'src/assets/styles/internal/amblin/style.scss';
  
  .viewer {
    height: calc(100vh - #{$content-navbar-height});
    overflow-wrap: break-word;
    overflow-y: auto;
    box-sizing: border-box;
    position: relative;
    padding: 20px 50px;
  }

  .viewer[data-fileFormat="html"] {
    #viewer-container {
      max-width: 768px;
      margin: 0 auto;
    }
  }
  

  .viewer[data-fileFormat="slides"],
  .viewer[data-fileFormat="pages"] {
    background-color: #FAFAFA;
    padding: 0;

    #viewer-container {
      transform: scale(0.75);
    }
  }

  #viewer-container {
    overflow-wrap: break-word;
    line-height: 1.6em;
    transform-origin: top left;

    .page-view {
      margin: 50px;
      overflow: hidden;
    }
  }
  
  #viewer-container,
  #reference-frame-of-viewer-container {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: black;

    .page-view {
      box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.3);
      position: relative;
      box-sizing: border-box;
      background-color: white;
    }
    
    img {
      height: auto;
      width: auto;
    }
  }
</style>
