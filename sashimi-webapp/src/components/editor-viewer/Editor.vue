<template>
  <div class="editor">
    <codemirror ref="myEditor"
                v-model="mdContent"
                :options="editorOptions"
                @change="onEditorCodeChange">
    </codemirror>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/keymap/sublime';

let codeMirrorInstance = null;

export default {
  components: {
    codemirror
  },
  props: ['value'],
  data() {
    return {
      isBeingLoaded: true,
      mdContent: this.value,
      editorOptions: {
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
    onEditorCodeChange(newCode) {
      this.$emit('input', newCode);
    },
  },
  watch: {
    value(data) {
      if (this.isBeingLoaded) {
        this.mdContent = data;
        codeMirrorInstance.setCursor(data.length);
        this.isBeingLoaded = false;
      }
    }
  },
  mounted() {
    codeMirrorInstance = this.$refs.myEditor.editor;
  }
};

</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

.editor {
  box-shadow: 4px 0 12px 0px rgba(0, 0, 0, 0.3);
  height: calc(100vh - #{$content-navbar-height});
}
</style>

<style lang="scss">
.editor {
  .CodeMirror {
    height: 100%;
    line-height: 140%;
    font-size: 16px;
  }
}
</style>
