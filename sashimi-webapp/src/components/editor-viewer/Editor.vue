<template>
  <div class="editor">
    <codemirror v-model="mdContent" ref="myEditor" :options="editorOption" @changed="codeChange"> 
    </codemirror>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import navbar from './Navbar';
import viewer from './Viewer';

/* eslint no-unused-vars: 0 */
let codeMirrorInstance = null;

/* eslint prefer-const: 0 */
export default {
  components: {
    codemirror,
    navbar,
    viewer,
  },
  props: ['value'],
  data() {
    return {
      mdContent: this.value,
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
      this.$emit('input', newCode);
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
@import 'src/assets/styles/variables.scss';

.editor {
  box-shadow: 4px 0 12px 0px rgba(0, 0, 0, 0.2);
  height: calc(100vh - #{$content-navbar-height});
}
</style>

<style lang="scss">
.editor {
  .CodeMirror.cm-s-base16-dark {
    height: 100%;
  }

  .CodeMirror-lines {
    .CodeMirror-code {
      color: #dedede;
      font-family: monospace;
    }
  }
}
</style>
