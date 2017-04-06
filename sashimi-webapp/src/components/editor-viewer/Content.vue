<template>
  <div>
    <navbar v-model="navbarInput"></navbar>
    <div class="section group content" v-bind:data-viewMode="viewMode">
      <div class="col editor-wrapper">
        <editor 
          v-model="mdContent"
        ></editor>
      </div>
      <div class="col viewer-wrapper">
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

let contentVue = null;

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
      changeViewModeOnResize: function() {
        if (window.innerWidth < 768 && this.viewMode === 'split') {
          this.viewMode = 'editor';
        }
      }
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
      this.file.save(value);
    }, 1000),
  },
  method: {
  },
  computed: {
  },
  mounted() {
    contentVue = this;

    // for testing purposes
    // will be handled by fileManager logic
    const fileID = parseInt(this.$route.query.id);

    this.file = fileManager.getFileByID(fileID);
    this.file.load()
      .then((data) => {
        this.mdContent = data;
      });

    if (window.innerWidth < 768) {
      this.viewMode = 'editor';
    }

    window.addEventListener('resize', this.changeViewModeOnResize.bind(contentVue));
  },
  beforeDestroy() {
    contentVue = this;

    window.removeEventListener('resize', this.changeViewModeOnResize.bind(contentVue));
  }
};

</script>

<style scoped lang="scss">
.hide {
  display: none;
}

.viewer-wrapper,
.editor-wrapper {
  transition: width 0.7s;
}

.content {
  overflow-x: hidden;

  &[data-viewMode="editor"] {
    .viewer-wrapper {
      width: 0;
    }

    .editor-wrapper {
      width: 100%;
    }
  }

  &[data-viewMode="split"] {
    .viewer-wrapper,
    .editor-wrapper {
      width: 50%;
    }

  }

  &[data-viewMode="viewer"] {
    .viewer-wrapper {
      width: 100%;
    }

    .editor-wrapper {
      width: 0;
    }
  }
} 
</style>
