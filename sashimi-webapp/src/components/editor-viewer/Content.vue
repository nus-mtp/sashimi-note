<template>
  <div>
    <navbar v-model="navbarInput"></navbar>
    <div class="section group content" v-bind:data-viewMode="viewMode">
      <div class="col editor-wrapper">
        <editor 
          v-model="mdContent"
          :scrollPosition="scrollPosition"
          v-on:updateScrollPosition="updateScrollPosition"
        ></editor>
      </div>
      <div class="col viewer-wrapper">
        <viewer 
          :editor-content="mdContent"
          :file-format="fileFormat"
          :scrollPosition="scrollPosition"
          v-on:updateScrollPosition="updateScrollPosition"
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
      scrollPosition: 1,
      changeViewModeOnResize() {
        if (window.innerWidth < 768 && this.viewMode === 'split') {
          this.viewMode = 'editor';
          this.navbarInput = 'editor';
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
      if (this.file) {
        this.file.save(value);
      }
    }, 1000),
  },
  methods: {
    updateScrollPosition(position) {
      this.scrollPosition = position;
      console.log('changing position to ', this.scrollPosition);
    }
  },
  computed: {
  },
  mounted() {
    contentVue = this;

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
