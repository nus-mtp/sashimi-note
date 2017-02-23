<template>
  <div class="viewer">
    <div v-if="viewMode === 'pages'">
      <div id="viewer-pages" v-html="getMarkdown">
      </div>
    </div>
    <div v-else-if="viewMode === 'slides'">
      <div id="viewer-slides" v-html="getMarkdown">
      </div>
    </div>
    <div v-else>
      <div id="viewer-html" v-html="getMarkdown">
      </div>
    </div>
  </div>
</template>

<script>
  import wrapper from 'src/logic/wrapper';

  // getParameterByName is used to obtain the query string form the url.
  // Currently the viewMode is being obtained via query string:
  // ?viewMode=pages
  // TOOD: In release, the viewMode should be passed down from the parent instead.
  function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    /* eslint no-useless-escape: 0 */
    name = name.replace(/[\[\]]/g, '\\$&');
    /* eslint prefer-template: 0 */
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  export default {
    props: ['editorContent'],
    data() {
      return {
        viewMode: '',
      };
    },
    computed: {
      getMarkdown() {
        return wrapper.render(this.editorContent);
      },
    },
    mounted() {
      // TODO: get viewMode from prop during release
      this.viewMode = getParameterByName('viewMode') || 'html';
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
