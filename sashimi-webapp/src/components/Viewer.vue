<template>
  <div class="viewer">
    <div v-html="getMarkdown">
    </div>
  </div>
</template>

<script>
  import wrapper from '../logic/wrapper';

  export default {
    props: ['editorContent'],
    computed: {
      getMarkdown() {
        return wrapper.render(this.editorContent);
      },
    }
  };
</script>

<style scoped lang='scss'>
  @import '../assets/styles/variables.scss';
  
  .viewer {
    height: calc(100vh - #{$navbar-height});
    overflow-wrap: break-word;
    overflow-y: scroll;
    box-sizing: border-box;
    margin: 0;
    padding: 30px;
    line-height: 1.6em;
    font-size: 17px;

    p {
      margin: 5px;
    }
  }
</style>
