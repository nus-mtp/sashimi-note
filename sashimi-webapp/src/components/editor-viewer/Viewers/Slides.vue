<template>
  <div id='viewer-container'></div>
</template>

<script>
  import Vue from 'vue';
  import _ from 'lodash';
  import PageRenderer from 'src/logic/renderer';
  
  // Declare page renderers instance. These renderer
  // will be initialised when this component is mounted.
  let pageRenderer = null;

  // Throttle function used to limit the rate which
  // the render function is called
  const throttleTime = 600;
  const renderThrottleFn = _.throttle((htmlData, pr) => pr.write(htmlData), throttleTime);

  const updateViewer = ((component) => {
    renderThrottleFn(component.htmlData, pageRenderer);
  });

  export default {
    props: ['htmlData'],
    data() {
      return {};
    },
    watch: {
      htmlData() {
        updateViewer(this);
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
      const self = this;
      Vue.nextTick(() => {
        pageRenderer = new PageRenderer('viewer-container', PAGE_A6);
        updateViewer(self);
      });
    }
  };

</script>
