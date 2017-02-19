<template>
  <div v-html="getMarkdown">
  </div>
</template>

<script>
  import wrapper from '../logic/wrapper';

  export default {
    computed: {
      getMarkdown() {
        return wrapper.render(this.content);
      },
    }
  };
</script>
