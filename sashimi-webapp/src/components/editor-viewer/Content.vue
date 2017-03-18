<template>
  <div>
    <navbar v-model="action"></navbar>
    <div class="section group content">
      <div class="col editor-wrapper" v-bind:class="editorCols">
        <editor 
          v-model="mdContent"
        ></editor>
      </div>
      <div class="col viewer-wrapper" v-bind:class="viewerCols">
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
import _ from 'lodash';
import fileManager from 'src/logic/filemanager';
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
      fileFormat: 'html',
      file: null,
      editorCols: {
        span_6_of_12: true,
        span_12_of_12: false,
        span_0_of_12: false
      },
      viewerCols: {
        span_6_of_12: true,
        span_12_of_12: false,
        span_0_of_12: false
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
            this.viewerCols.span_0_of_12 = true;
            this.editorCols.span_0_of_12 = false;
            break;
          case 'viewer':
            this.editorCols.span_12_of_12 = false;
            this.editorCols.span_6_of_12 = false;
            this.viewerCols.span_6_of_12 = false;
            this.viewerCols.span_12_of_12 = true;
            this.editorCols.span_0_of_12 = true;
            this.viewerCols.span_0_of_12 = false;
            break;
          default:
          // split screen
            this.editorCols.span_6_of_12 = true;
            this.viewerCols.span_6_of_12 = true;
            this.editorCols.span_12_of_12 = false;
            this.viewerCols.span_12_of_12 = false;
            this.editorCols.span_0_of_12 = false;
            this.viewerCols.span_0_of_12 = false;
            break;
        }
      }
    },
    mdContent: _.debounce(function saveFile(value) {
      this.file.save(value);
    }, 1000),
  },
  method: {
  },
  computed: {
  },
  mounted() {
    this.file = fileManager.getFileByID(this.$route.query.id);
    this.file.load()
    .then((data) => {
      this.mdContent = data;
    });
  }
};

</script>

<style scoped lang="scss">
.hide {
  display: none;
}

.span_6_of_12,
.span_12_of_12,
.span_0_of_12 {
  transition: width 0.7s;
}

.content {
  overflow-x: hidden;
}
</style>
