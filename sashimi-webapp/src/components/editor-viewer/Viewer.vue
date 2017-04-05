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
  
  .viewer {
    height: calc(100vh - #{$content-navbar-height});
    overflow: hidden;
  }
</style>
