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
  props: ['value', 'scrollPosition'],
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
      },
      // Scroll related functions
      localScrollPosition: 1,
      canUserScroll: true,
      canOtherScroll: true,
      enableUserScrollListener: () => { this.canUserScroll = true; },
      disableUserScrollListener: () => { this.canUserScroll = false; },
      userScrollListeners: [],
      enableOtherScrolledListener: () => { this.canOtherScroll = true; },
      disableOtherScrolledListener: () => { this.canOtherScroll = false; },
      otherScrollListeners: [],
      /**
       * This function is called user is scrolling the component
       */
      broadcastNewScrollPosition: (cmInstance) => {
        // If it is being scrolled by other component,
        // no need to broadcast scroll position again
        if (!this.canUserScroll) return;

        // Prevent programatic updating by own component
        this.disableOtherScrolledListener();
        this.userScrollListeners.forEach(clearTimeout);

        // Retrieve scroll information for emitting
        const cmScrollTop = cmInstance.getScrollInfo().top;
        const newLinePosition = cmInstance.lineAtHeight(cmScrollTop, 'local') + 1;
        this.$emit('updateViewerScrollPosition', newLinePosition);

        // Welcome programatic updating by own component again after a while
        this.userScrollListeners.push(setTimeout(this.enableOtherScrolledListener, 1000));
      },
      /**
       * This function is called when the component receive scroll update signal
       * from other component
       */
      updateScrollPosition: (position) => {
        // If user is scrolling this component, disable scroll manipulation
        if (!this.canOtherScroll) return;
        if (this.localScrollPosition === position) return;

        // Prevent scroll position listener from manually adjusting the scroll height again
        this.disableUserScrollListener();
        this.userScrollListeners.forEach(clearTimeout);

        // Retrieve scroll information for setting height
        const destinationOffSetHeight = codeMirrorInstance.heightAtLine(position) - 82;
        const destinationPosition = destinationOffSetHeight + codeMirrorInstance.getScrollInfo().top;
        codeMirrorInstance.scrollTo(0, destinationPosition);

        // listener for scroll position from
        this.userScrollListeners.push(setTimeout(this.enableUserScrollListener, 1000));
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
    },
    scrollPosition(position) {
      this.updateScrollPosition(position);
    }
  },
  mounted() {
    codeMirrorInstance = this.$refs.myEditor.editor;
    codeMirrorInstance.on('scroll', this.broadcastNewScrollPosition);
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
