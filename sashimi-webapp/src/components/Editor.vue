<template>
  <div>
    <navbar></navbar>
    <codemirror v-model="content" @changed="codeChange" > 
    </codemirror>
    <p>{{content}}</p>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import navbar from './Navbar';
import cm from '../mock/contentManipulator';

/* eslint prefer-const: 0 */
export default {
  components: {
    codemirror,
    navbar
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
