<template>
  <div>
    <navbar v-model="navbarInput"></navbar>
    <div class="section group content" v-bind:data-viewMode="viewMode">
      <div class="col editor-wrapper">
        <editor 
          v-model="mdContent"
          :scrollPosition="editorScrollPosition"
          v-on:updateViewerScrollPosition="updateViewerScrollPosition"
        ></editor>
      </div>
      <div class="col viewer-wrapper">
        <viewer 
          :editor-content="mdContent"
          :file-format="fileFormat"
          :scrollPosition="viewerScrollPosition"
          v-on:updateEditorScrollPosition="updateEditorScrollPosition"
          >
        </viewer>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import fileManager from 'src/logic/filemanager';
import featureData from 'src/../static/data/features.txt';
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
      fileFormat: 'html',
      file: null,
      viewMode: 'split',
      navbarInput: this.viewMode,
      editorScrollPosition: 1,
      viewerScrollPosition: 1,
    };
  },
  watch: {
    navbarInput(value) {
      switch (value) {
        case 'pages':
        case 'slides':
        case 'html': {
          this.fileFormat = value;
          break;
        }

        case 'editor':
        case 'viewer':
        case 'split': {
          this.viewMode = value;
          break;
        }

        default: break;
      }
    },
    mdContent: _.debounce(function saveFile(value) {
      if (this.file) {
        this.file.save(value);
      }
    }, 1000),
  },
  methods: {
    updateViewerScrollPosition(position) {
      this.viewerScrollPosition = position;
    },
    updateEditorScrollPosition(position) {
      this.editorScrollPosition = position;
    }
  },
  computed: {
  },
  mounted() {
    if (this.$route.path === '/features') {
      // Special case to handle feature document
      this.mdContent = featureData;
    } else {
      // for testing purposes
      // will be handled by fileManager logic
      const fileID = parseInt(this.$route.query.id);
      if (fileID && fileManager.getFileByID(fileID)) {
        this.file = fileManager.getFileByID(fileID);
        this.file.load()
          .then((data) => {
            this.mdContent = data;
          });
      } else {
        this.$router.push('/');
      }
    }
  },
  beforeDestroy() {
  }
};

</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

.hide {
  display: none;
}

.viewer-wrapper,
.editor-wrapper {
  transition: width 0.7s;
}

.content {
  overflow-x: hidden;

  .viewer-wrapper,
  .editor-wrapper {
    & > div { height: calc(100vh - #{$content-navbar-height}); }
  }

  &[data-viewMode="editor"] {
    .viewer-wrapper { width: 0; }
    .editor-wrapper { width: 100%; }
  }

  &[data-viewMode="viewer"] {
    .viewer-wrapper { width: 100%; }
    .editor-wrapper { width: 0; }
  }

  &[data-viewMode="split"] {
    .viewer-wrapper,
    .editor-wrapper {
      width: 100%;
      & > div { height: calc(50vh - #{$content-navbar-height/2}); }
      @media screen and (min-width: 768px) {
        & > div { height: initial }
      }
    }
  }
} 
</style>
