<template>
  <div class="viewer">
    <div v-html="getMarkdown">
    </div>
  </div>
</template>

<script>
  import wrapper from '../../logic/wrapper';

  export default {
    props: ['editorContent', 'fileFormat'],
    watch: {
    },
    computed: {
      getMarkdown() {
        return wrapper.render(this.editorContent);
      },
    }
  };
</script>

<style scoped lang='scss'>
  @import 'src/assets/styles/variables.scss';
  
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
