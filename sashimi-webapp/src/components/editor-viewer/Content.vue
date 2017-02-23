<template>
  <div>
    <navbar></navbar>
    <div class="section group">
      <div class="col span_6_of_12">
        <editor 
          v-model="mdContent"
        ></editor>
      </div>
      <div class="col span_6_of_12">
        <viewer :editor-content="mdContent"></viewer>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from './Navbar';
import viewer from './Viewer';
import editor from './Editor';

/* eslint prefer-const: 0 */
export default {
  components: {
    navbar,
    viewer,
    editor,
  },
  data() {
    return {
      mdContent: '',
    };
  },
  method: {
  },
  computed: {
  },
  mounted() {
  }
};

</script>

<style scoped lang="scss">

</style>
