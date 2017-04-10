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
  import documentBuilder from 'src/helpers/documentBuilder';
  import PageRenderer from 'src/logic/renderer';
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
    mounted() {
      // Print
      this.printDocument = (event) => {
        if (event.key === 'p' && event.ctrlKey) {
          event.preventDefault();

          const frame = {
            url: 'about:blank',
            target: '_blank',
            feature: 'location=yes,height=600,width=800,scrollbars=yes',
          };

          const printFrame = window.open(frame.url, frame.target, frame.feature);
          documentBuilder.rebuild(printFrame);
          documentBuilder.addStyles(printFrame, [
            '/styles/markdown-html.css',
            '/styles/viewer-page.css',
            '/styles/markdown-imports.css'
          ])
          .then(() => {
            const iframeDoc = documentBuilder.getDocument(printFrame);
            iframeDoc.title = 'Sashimi Printed Document';

            const eleParent = iframeDoc.createElement('div');
            const eleContainer = iframeDoc.createElement('div');
            eleParent.appendChild(eleContainer);
            iframeDoc.body.appendChild(eleParent);
            return eleContainer;
          })
          .then((renderTarget) => {
            const pr = new PageRenderer(renderTarget);
            return documentPackager.getHtmlData(this.editorContent)
            .then(htmlData => pr.write(htmlData));
          })
          .then(() => {
            printFrame.focus();
            printFrame.print();
          });
        }
      };
      window.addEventListener('keydown', this.printDocument);
    },
    beforeDestroy() {
      window.removeEventListener('keydown', this.printDocument);
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
