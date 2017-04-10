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
        renderDoc: null,
        pageRenderer: null,
        documentNavigator: null
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
        documentBuilder.rebuild(this.$el);
        documentBuilder.addStyles(this.$el, [
          '/styles/markdown-html.css',
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
          this.pageRenderer = new PageRenderer(renderTarget);
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
