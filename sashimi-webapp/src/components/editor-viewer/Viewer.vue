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
  const throttleTime = 100;

  const updateViewer = ((vueComponent) => {
    if (vueComponent.fileFormat === 'pages') {
      vueComponent.pagesRenderThrottleFn(vueComponent.editorContent);
    } else if (vueComponent.fileFormat === 'slides') {
      vueComponent.slidesRenderThrottleFn(vueComponent.editorContent);
    }
  });

  export default {
    props: ['editorContent', 'fileFormat'],
    data() {
      return {
        prPages: null,
        prSlides: null,
        pagesRenderThrottleFn: _.throttle((markdownString) => {
          documentPackager.getHtmlData(markdownString)
          .then((htmlString) => {
            if (!this.prPages) this.prPages = new PageRenderer('viewer-container');
            this.prPages.write(htmlString);
          });
        }, throttleTime),
        slidesRenderThrottleFn: _.throttle((markdownString) => {
          documentPackager.getHtmlData(markdownString)
          .then((htmlString) => {
            if (!this.prSlides) {
              this.prSlides = new PageRenderer(
                'viewer-container',
                {
                  width: '14.8cm',
                  height: '10.5cm',
                  padding: {
                    top: '1.2cm',
                    bottom: '1.2cm',
                    right: '1.2cm',
                    left: '1.2cm'
                  }
                });
            }
            this.prSlides.write(htmlString);
          });
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
    }
  };

</script>

<style lang='scss'>
  @import 'src/assets/styles/variables.scss';
  
  .viewer {
    height: calc(100vh - #{$content-navbar-height});
    overflow-wrap: break-word;
    overflow-y: auto;
    box-sizing: border-box;
    position: relative;
    padding: 20px 50px;
  }

  .viewer[data-fileFormat="slides"],
  .viewer[data-fileFormat="pages"] {
    background-color: #FAFAFA;
    padding: 0;
  }

  #viewer-container {
    overflow-wrap: break-word;
    line-height: 1.6em;
    transform: scale(0.75);
    transform-origin: top left;

    .page-view {
      margin: 50px;
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
    
    img, pre, blockquote, p {
      width: 100%;
      margin: 0;
    }

    img {
      height: auto;
      width: auto;
    }
  }
</style>
