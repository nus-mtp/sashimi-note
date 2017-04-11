<template>
  <div class="viewer" v-bind:data-fileFormat='fileFormat'>
    <viewerPages 
      v-if="fileFormat === 'pages'"
      v-bind:htmlData="htmlData"
    ></viewerPages>
    <viewerSlides 
      v-else-if="fileFormat === 'slides'"
      v-bind:htmlData="htmlData"
    ></viewerSlides>
    <viewerHtml 
      v-else 
      v-bind:htmlData="htmlData"
    ></viewerHtml>
  </div>
</template>

<script>
  import Vue from 'vue';
  import _ from 'lodash';
  import AsyncComputed from 'vue-async-computed';
  import documentPackager from 'src/logic/documentPackager';
  import viewerPages from './Viewers/Pages';
  import viewerSlides from './Viewers/Slides';
  import viewerHtml from './Viewers/Html';

  Vue.use(AsyncComputed);

  const convertThrottle = _.throttle((data) => { documentPackager.getHtmlData(data); }, 1000);


  export default {
    components: {
      viewerPages,
      viewerSlides,
      viewerHtml,
    },
    data() {
      return {
        htmlData: ''
      };
    },
    props: ['editorContent', 'fileFormat'],
    watch: {
      editorContent(data) {
        convertThrottle(data);
      }
    },
    // asyncComputed: {
    //   getHtmlData() {
    //     return documentPackager.getHtmlData(this.editorContent);
    //   }
    // },
    mounted() {
      documentPackager.init((event) => {
        this.htmlData = event.data;
      });
      // setInterval(() => {
      //   documentPackager.getHtmlData('haha');
      // }, 1500);
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
