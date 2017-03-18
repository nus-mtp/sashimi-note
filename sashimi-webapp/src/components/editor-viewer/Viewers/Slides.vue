<template>
  <div id='viewer-container'>
    <div class="page-view"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import _ from 'lodash';
  import PageRenderer from 'src/logic/renderer';
  import DocumentNavigator from 'src/logic/inputHandler/DocumentNavigator';
  
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
        this.pageRenderer = new PageRenderer('viewer-container', PAGE_A6);
        renderThrottleFn(this.htmlData, this.pageRenderer);

        // Initialise navigation for Slide mode
        this.documentNavigator = new DocumentNavigator(
          this.pageRenderer.page,
          '#viewer-container',
          '.page-view'
        );
      });
    },
    beforeDestroy() {
      this.documentNavigator.removeListeners();
    }
  };

</script>
