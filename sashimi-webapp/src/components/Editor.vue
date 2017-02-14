<template>
  <div>
    <navbar></navbar>
    <div class="section group">
      <div class="col span_6_of_12">
        <div>
          <codemirror v-model="content" ref="myEditor" @changed="codeChange"> 
          </codemirror>
        </div>
      </div>
      <div class="col span_6_of_12">
        <div class="viewer">
          <div v-html="getMarkdown"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import MarkdownIt from 'markdown-it';
import navbar from './Navbar';

const md = new MarkdownIt();
let content = '';
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

  .viewer {
    height: calc(100vh - 100px);
    overflow-wrap: break-word;
    overflow-y: scroll;

    p {
      margin: 5px;
    }
  }
</style>
