<template>
  <iframe
    id="viewer-container"
    height="100%"
    width="100%"
    frameborder="0"
  ></iframe>
</template>

<script>
  import Vue from 'vue';
  import _ from 'lodash';
  import DiagramsRenderer from 'src/logic/renderer/diagrams';
  import PageRenderer from 'src/logic/renderer';
  import DocumentNavigator from 'src/logic/inputHandler/DocumentNavigator';
  import documentBuilder from 'src/helpers/documentBuilder';

  // Throttle function used to limit the rate which
  // the render function is called
  const throttleTime = 600;
  const renderThrottleFn = _.throttle((htmlData, pr) => pr.write(htmlData), throttleTime);

  export default {
    props: ['htmlData'],
    data() {
      return {
        diagramsRenderer: null,
        pageRenderer: null,
        documentNavigator: null,
        pageSize: { // PAGE_A4
          width: '21.0cm',
          height: '29.7cm',
          padding: {
            top: '2.54cm',
            bottom: '2.54cm',
            right: '2.54cm',
            left: '2.54cm'
          }
        }
      };
    },
    watch: {
      htmlData() {
        renderThrottleFn(this.htmlData, this.pageRenderer);
      }
    },
    mounted() {
      // Mount does not gurrantee DOM to be ready, thus nextTick is used
      Vue.nextTick(() => {
        this.diagramsRenderer = new DiagramsRenderer();
        documentBuilder.rebuild(this.$el);
        documentBuilder.addStyles(this.$el, [
          '/styles/markdown-pages.css',
          '/styles/viewer-page.css',
          '/styles/markdown-imports.css'
        ])
        .catch((error) => {
          /* eslint no-console: 0 */
          if (error.message.includes('Error loading style')) {
            // Disregard loading error and continue to render document.
            console.error(error.message);
          } else {
            throw error;
          }
        })
        .then(() => {
          const iframeDoc = documentBuilder.getDocument(this.$el);

          const eleParent = iframeDoc.createElement('div');
          const eleContainer = iframeDoc.createElement('div');
          eleParent.appendChild(eleContainer);
          iframeDoc.body.appendChild(eleParent);
          return eleContainer;
        })
        .then((renderTarget) => {
          this.pageRenderer = new PageRenderer(renderTarget, this.pageSize, [
            this.diagramsRenderer
          ]);
          return renderThrottleFn(this.htmlData, this.pageRenderer)
          .then(() => {
            // Initialise navigation for Pages mode
            const resizeObserveTarget = this.$el.parentNode.parentNode;
            this.documentNavigator = new DocumentNavigator(renderTarget, resizeObserveTarget, this.$el);
          });
        });
      });
    }
  };

</script>
