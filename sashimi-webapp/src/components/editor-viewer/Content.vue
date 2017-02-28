<template>
  <div>
    <navbar v-model="action"></navbar>
    <div class="section group">
      <div class="col" v-bind:class="editorCols">
        <editor 
          v-model="mdContent"
        ></editor>
      </div>
      <div class="col" v-bind:class="viewerCols">
        <viewer 
          :editor-content="mdContent" 
          :file-format="fileFormat" 
          >
        </viewer>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from './Navbar';
import viewer from './Viewer';
import editor from './Editor';

export default {
  components: {
    navbar,
    viewer,
    editor,
  },
  data() {
    return {
      mdContent: '',
      action: '',
      fileFormat: '',
      editorCols: {
        span_6_of_12: true,
        span_12_of_12: false,
        hide: false
      },
      viewerCols: {
        span_6_of_12: true,
        span_12_of_12: false,
        hide: false
      }
    };
  },
  watch: {
    action(value) {
      if (value === 'pages' || value === 'slides' || value === 'html') {
        this.fileFormat = value;
      } else if (value === 'editor' || value === 'viewer' || value === 'split') {
        switch (value) {
          case 'editor':
            this.editorCols.span_12_of_12 = true;
            this.editorCols.span_6_of_12 = false;
            this.viewerCols.span_6_of_12 = false;
            this.viewerCols.span_12_of_12 = false;
            this.viewerCols.hide = true;
            this.editorCols.hide = false;
            break;
          case 'viewer':
            this.editorCols.span_12_of_12 = false;
            this.editorCols.span_6_of_12 = false;
            this.viewerCols.span_6_of_12 = false;
            this.viewerCols.span_12_of_12 = true;
            this.editorCols.hide = true;
            this.viewerCols.hide = false;
            break;
          default:
          // split screen
            this.editorCols.span_6_of_12 = true;
            this.viewerCols.span_6_of_12 = true;
            this.editorCols.span_12_of_12 = false;
            this.viewerCols.span_12_of_12 = false;
            this.editorCols.hide = false;
            this.viewerCols.hide = false;
            break;
        }
      }
    }
  },
  method: {
  },
  computed: {
  },
  mounted() {
    console.log(this.$route.query.id);

    // if id != null
    //  load content
  }
};

</script>

<style scoped lang="scss">
.hide {
  display: none;
}
</style>
