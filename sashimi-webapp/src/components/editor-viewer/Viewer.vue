<template>
  <div class="viewer" v-bind:data-fileFormat='fileFormat'>
    <viewerPages 
      v-if="fileFormat === 'pages'"
      :htmlData="htmlData"
      :scrollPosition="scrollPosition"
      v-on:updateEditorScrollPosition="updateEditorScrollPosition"
    ></viewerPages>
    <viewerSlides 
      v-else-if="fileFormat === 'slides'"
      :htmlData="htmlData"
      :scrollPosition="scrollPosition"
      v-on:updateEditorScrollPosition="updateEditorScrollPosition"
    ></viewerSlides>
    <viewerHtml 
      v-else 
      :htmlData="htmlData"
      :scrollPosition="scrollPosition"
      v-on:updateEditorScrollPosition="updateEditorScrollPosition"
    ></viewerHtml>
  </div>
</template>

<script>
  import Vue from 'vue';
  import _ from 'lodash';
  import AsyncComputed from 'vue-async-computed';
  import documentPackager from 'src/logic/documentPackager';
  import DocumentPrinter from 'src/logic/inputHandler/DocumentPrinter';
  import viewerPages from './Viewers/Pages';
  import viewerSlides from './Viewers/Slides';
  import viewerHtml from './Viewers/Html';

  Vue.use(AsyncComputed);

  let documentPrinter = null;
  const htmlParserTrottleFn = _.throttle(function parseFn(data) {
    documentPackager.getHtmlData(data)
    .then((htmlData) => {
      this.htmlData = htmlData;
    });
  }, 1000);

  export default {
    components: {
      viewerPages,
      viewerSlides,
      viewerHtml,
    },
    data() {
      return {
        htmlData: '',
      };
    },
    props: ['editorContent', 'fileFormat', 'scrollPosition'],
    watch: {
      fileFormat() {
        // Update event listener reference on fileFormat change
        documentPrinter.setDomBehaviour();
      },
      editorContent(data) {
        htmlParserTrottleFn.call(this, data);
      }
    },
    methods: {
      updateEditorScrollPosition(newLinePosition) {
        this.$emit('updateEditorScrollPosition', newLinePosition);
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
