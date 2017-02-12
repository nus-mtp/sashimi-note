<template>
  <div>
    <navbar></navbar>
    <div class="row">
      <div class="col-md-6">
        <div>
          <codemirror v-model="content" > 
          </codemirror>
        </div>
      </div>
      <div class="col-md-5">
        <p>{{content}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import navbar from './Navbar';

let content = "";

/* eslint prefer-const: 0 */
export default {
  components: {
    codemirror,
    navbar
  },

  data() {
    return {
      content,
    };
  },
};

</script>

<style scoped lang="scss">
  p {
    margin: 5px 0 5px 2px;
  }
</style>
