<template>
  <div>
    <codemirror v-model="content" @changed="codeChange" > 
    </codemirror>
    <p>{{content}}</p>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import cm from '../mock/contentManipulator';

/* eslint prefer-const: 0 */
export default {
  components: {
    codemirror,
  },

  data() {
    return {
      content: cm.testString,
    };
  },

  methods: {
    codeChange(newCode) {
      cm.testString = newCode;
      /* eslint no-console: 0 */
      // console.log(cm.testString);
    },
  },
};

</script>

<style scoped lang="scss">

</style>
