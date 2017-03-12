<template>
  <div class="viewer" v-bind:data-fileFormat='fileFormat'>
    <viewerPages 
      v-if="fileFormat === 'pages'"
      v-bind:htmlData="getHtmlData"
    ></viewerPages>
    <viewerSlides 
      v-else-if="fileFormat === 'slides'"
      v-bind:htmlData="getHtmlData"
    ></viewerSlides>
    <viewerHtml 
      v-else 
      v-bind:htmlData="getHtmlData"
    ></viewerHtml>
  </div>
</template>

<script>
  import Vue from 'vue';
  import AsyncComputed from 'vue-async-computed';
  import documentPackager from 'src/logic/documentPackager';
  import viewerPages from './Viewers/Pages';
  import viewerSlides from './Viewers/Slides';
  import viewerHtml from './Viewers/Html';

  Vue.use(AsyncComputed);

  export default {
    components: {
      viewerPages,
      viewerSlides,
      viewerHtml,
    },
    props: ['editorContent', 'fileFormat'],
    asyncComputed: {
      getHtmlData() {
        return documentPackager.getHtmlData(this.editorContent);
      }
    },
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
    overflow: hidden;

    #viewer-container {
      cursor: pointer;
      transform: scale(1);
      transition: transform 0.1s;
      width: 1px;
      margin: 0 auto;
      position: relative;

      .page-view {
        overflow: hidden;
        margin: 0 auto;
        margin-top: 50px;
      }
    }
  }

  #viewer-container {
    transform-origin: 50% 0%;
  }
  
  #viewer-container,
  #reference-frame-of-viewer-container {
    overflow-wrap: break-word;
    line-height: 1.6em;
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
  }

  @media print {
    @page {
      size: auto;
      margin: 0;
    }

    #app > div > div.section.group.content > div:nth-child(2) {
      width: 100%;
    }

    .viewer {
      height: 100%;
    }

    .navbar, .editor {
      display: none;
    }

    .viewer[data-fileFormat="slides"],
    .viewer[data-fileFormat="pages"] {
      background: none;

      #viewer-container {
        transform: scale(1);
        overflow: hidden;

        .page-view {
          overflow: hidden;
          margin: 0;
          margin-top: 0;
        }
      }
    }
  }
</style>
