<template>
  <div class="viewer">
    <div v-if="viewMode === 'pages'">
      <div id="viewer-pages" v-html="getHtml">
      </div>
    </div>
    <div v-else-if="viewMode === 'slides'">
      <div id="viewer-slides" v-html="getHtml">
      </div>
    </div>
    <div v-else>
      <div id="viewer-html" v-html="getHtml">
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import AsyncComputed from 'vue-async-computed';
  import documentPackager from 'src/logic/documentPackager';
  import urlHelper from 'src/helpers/url';

  Vue.use(AsyncComputed);

  // getParameterByName is used to obtain the query string form the url.
  // Currently the viewMode is being obtained via query string:
  // ?viewMode=pages
  // TOOD: In release, the viewMode should be passed down from the parent instead.
  

  export default {
    props: ['editorContent'],
    data() {
      return {
        viewMode: '',
      };
    },
    computed: {
      getHtml() {
        return documentPackager.render(this.editorContent);
      },
    },
    mounted() {
      // TODO: get viewMode from prop during release
      this.viewMode = urlHelper.getParameterByName('viewMode') || 'html';
    }
  };
</script>

<style scoped lang='scss'>
  @import '../../../assets/styles/variables.scss';
  
  .viewer {
    height: calc(100vh - #{$navbar-height});
    overflow-wrap: break-word;
    overflow-y: scroll;
    box-sizing: border-box;
    margin-left: 10px;
    line-height: 1.6em;

    p {
      margin-top: 7px;
    }
  }
</style>
