<template>
  <div>
    <navbar v-model="action"></navbar>
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
      viewMode: 'split'
    };
  },
  watch: {
    action(value) {
      if (value === 'pages' || value === 'slides' || value === 'html') {
        this.fileFormat = value;
      } else if (value === 'editor' || value === 'viewer' || value === 'split') {
        this.viewMode = value;
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

// .viewer-wrapper {
//   display: none;
// }

@media screen and (min-width: 768px) {
  .viewer-wrapper {
    display: inline-block;
  }
}
</style>
