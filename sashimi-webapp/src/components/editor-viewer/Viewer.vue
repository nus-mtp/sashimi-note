<template>
  <div class="viewer">
    <div v-if="fileFormat === 'pages'">
      <div id="viewer-pages">
        <div id='viewer-pages-container'></div>
      </div>
    </div>
    <div v-else-if="fileFormat === 'slides'">
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

  Vue.use(AsyncComputed);
  
  export default {
    props: ['editorContent', 'fileFormat'],
    watch: {
    },
    asyncComputed: {
      getHtmlData() {
        return documentPackager.getHtmlData(this.editorContent);
      },
    },
    mounted() {
    }
  };
</script>

<style scoped lang='scss'>
  @import 'src/assets/styles/variables.scss';
  
  .viewer {
    height: calc(100vh - #{$content-navbar-height});
    overflow-wrap: break-word;
    overflow-y: auto;
    box-sizing: border-box;
    margin-left: 10px;
    line-height: 1.6em;

    p {
      margin-top: 7px;
    }
  }
</style>
