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
      // Mount does not gurrantee DOM to be ready, thus nextTick is used
      const self = this;
      Vue.nextTick(() => {
        pageRenderer = new PageRenderer('viewer-container');
        updateViewer(self);
      });
    }
  };

</script>
