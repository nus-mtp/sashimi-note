<template>
  <div class="viewer" v-bind:data-fileFormat='fileFormat'>
    <viewerPages 
      v-if="fileFormat === 'pages'"
      :htmlData="getHtmlData"
      :scrollPosition="scrollPosition"
      v-on:updateScrollPosition="updateScrollPosition"
    ></viewerPages>
    <viewerSlides 
      v-else-if="fileFormat === 'slides'"
      :htmlData="getHtmlData"
      :scrollPosition="scrollPosition"
      v-on:updateScrollPosition="updateScrollPosition"
    ></viewerSlides>
    <viewerHtml 
      v-else 
      :htmlData="getHtmlData"
      :scrollPosition="scrollPosition"
      v-on:updateScrollPosition="updateScrollPosition"
    ></viewerHtml>
  </div>
</template>

<script>
  import Vue from 'vue';
  import AsyncComputed from 'vue-async-computed';
  import documentPackager from 'src/logic/documentPackager';
  import DocumentPrinter from 'src/logic/inputHandler/DocumentPrinter';
  import viewerPages from './Viewers/Pages';
  import viewerSlides from './Viewers/Slides';
  import viewerHtml from './Viewers/Html';

  Vue.use(AsyncComputed);

  let documentPrinter = null;

  export default {
    components: {
      viewerPages,
      viewerSlides,
      viewerHtml,
    },
    props: ['editorContent', 'fileFormat', 'scrollPosition'],
    asyncComputed: {
      getHtmlData() {
        return documentPackager.getHtmlData(this.editorContent);
      }
    },
    watch: {
      fileFormat() {
        // Update event listener reference on fileFormat change
        documentPrinter.setDomBehaviour();
      }
    },
    methods: {
      updateScrollPosition(newLinePosition) {
        this.$emit('updateScrollPosition', newLinePosition);
      }
    },
    mounted() {
      Vue.nextTick(() => {
        documentPrinter = new DocumentPrinter(window, this, 'editorContent');
      });
    },
    beforeDestroy() {
      documentPrinter.unsetDomBehaviour();
    }
  };

</script>

<style lang='scss'>
  @import 'src/assets/styles/variables.scss';
  
  .viewer {
    height: calc(100vh - #{$content-navbar-height});
    overflow: hidden;
  }
</style>
