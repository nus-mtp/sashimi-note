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
  import iframeBuilder from 'src/helpers/iframeBuilder';

  // Throttle function used to limit the rate which
  // the render function is called
  const throttleTime = 600;
  const renderThrottleFn = _.throttle((htmlData, pr) => pr.write(htmlData), throttleTime);

  export default {
    props: ['htmlData'],
    data() {
      return {
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
      const PAGE_A6 = {
        width: '16.51cm',
        height: '13.159cm',
        padding: {
          top: '1.2cm',
          bottom: '1.2cm',
          right: '1.2cm',
          left: '1.2cm'
        }
      };

      // Mount does not gurrantee DOM to be ready, thus nextTick is used
      Vue.nextTick(() => {
        iframeBuilder.rebuild(this.$el);
        iframeBuilder.addStyles(this.$el, [
          '/styles/markdown-html.css',
          '/styles/viewer-page.css',
          '/vendors/highlight.js/styles/ocean.css',
          '/vendors/katex/katex.min.css'
        ]);
        const iframeDoc = iframeBuilder.getDocument(this.$el);

        const eleParent = iframeDoc.createElement('div');
        const eleContainer = iframeDoc.createElement('div');
        eleParent.appendChild(eleContainer);
        iframeDoc.body.appendChild(eleParent);

        this.pageRenderer = new PageRenderer(eleContainer, PAGE_A6);
        renderThrottleFn(this.htmlData, this.pageRenderer)
        .then(() => {
          // Initialise navigation for Slide mode
          const resizeObserveTarget = this.$el.parentNode.parentNode;
          this.documentNavigator = new DocumentNavigator(eleContainer, resizeObserveTarget);
        });
      });
    },
    beforeDestroy() {
      this.documentNavigator.unsetDomBehaviour();
    }
  };
</script>
