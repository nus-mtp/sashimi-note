<template>
  <div id="viewer-container" v-html="htmlData"></div>
</template>

<script>
  export default {
    props: ['htmlData']
  };

</script>
