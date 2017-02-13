<template>
  <div>
    <navbar></navbar>
    <div class="row">
      <div class="col-md-6">
        <div>
          <codemirror v-model="content" ref="myEditor" @changed="codeChange"> 
          </codemirror>
        </div>
      </div>
      <div class="col-md-5">
        <div v-html="getMarkdown"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import MarkdownIt from 'markdown-it';
import navbar from './Navbar';

const md = new MarkdownIt();
let content = "";
let codeMirrorInstance = null;

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
  methods: {
    codeChange(newCode) {
      console.log(newCode);
    }
  },
  computed: {
    editor() {
      return this.$refs.myEditor.editor;
    },
    getMarkdown() {
      let tempContent = this.content || '';
      return md.render(tempContent);
    }
  },
  mounted() {
    codeMirrorInstance = this.editor;
  }
};

</script>

<style scoped lang="scss">
  p {
    margin: 5px 0 5px 2px;
  }
</style>
