<template>
  <div>
    <navbar></navbar>
    <div class="section group">
      <div class="col span_6_of_12">
        <div>
          <codemirror v-model="content" ref="myEditor" :options="editorOption" @changed="codeChange"> 
          </codemirror>
        </div>
      </div>
      <div class="col span_6_of_12">
        <div class="viewer">
          <viewer></viewer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import wrapper from '../logic/wrapper';
import navbar from './Navbar';
import viewer from './Viewer';

let content = '';
/* eslint : 0 */
let codeMirrorInstance = null;

/* eslint prefer-const: 0 */
export default {
  components: {
    codemirror,
    navbar,
    viewer,
  },

  data() {
    return {
      content,
      editorOption: {
        tabSize: 4,
        mode: 'text/x-markdown',
        theme: 'base16-dark',
        lineNumbers: true,
        lineWrapping: true,
        line: true,
        keyMap: 'sublime',
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        styleSelectedText: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
      }
    };
  },
  methods: {
    codeChange(newCode) {
    }
  },
  computed: {
    editor() {
      return this.$refs.myEditor.editor;
    },
  },
  mounted() {
    codeMirrorInstance = this.editor;
  }
};

</script>

<style scoped lang="scss">
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
