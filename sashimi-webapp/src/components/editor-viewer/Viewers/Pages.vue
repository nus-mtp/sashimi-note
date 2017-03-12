<template>
  <div id='viewer-container'></div>
</template>

<script>
  import Vue from 'vue';
  import _ from 'lodash';
  import PageRenderer from 'src/logic/renderer';
  
  // Throttle function used to limit the rate which
  // the render function is called
  const throttleTime = 600;
  const renderThrottleFn = _.throttle((htmlData, pr) => pr.write(htmlData), throttleTime);

  export default {
    props: ['htmlData'],
    data() {
      return {
        pageRenderer: null
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
        this.pageRenderer = new PageRenderer('viewer-container');
        renderThrottleFn(this.htmlData, this.pageRenderer);
      });
    }
  };

</script>
