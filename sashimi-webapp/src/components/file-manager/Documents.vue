<template>
  <div class="group section documents" 
    v-bind:class="viewMode"
  >
    <!--<div class="modal" v-show="modal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <h3>New {{value}}</h3>
      </div>
    </div>-->
    <folder 
      v-for="folder in docs.childFolderList"
      v-on:openFolder="changeFolder"
      v-on:focusFolder="focus"
      v-on:blurFolder="blur"
          :folder="folder"
    >
    </folder>
    <file 
      v-for="file in docs.childFileList"
      v-on:focusFile="focus"
      v-on:blurFile="blur"
          :file="file"
    >
    </file>
  </div>
</template>

<script>
import fileManager from 'src/logic/filemanager';
import eventHub from './EventHub';
import folder from './Folder';
import file from './File';

export default {
  props: ['viewMode', 'docs'],
  data() {
    return {
      modal: false,
      value: ''
    };
  },
  components: {
    folder,
    file,
  },
  watch: {
    $route(path) {
      if (path.query.folder === undefined) {
        const ROOT_FOLDER_ID = 0;
        const rootFolder = fileManager.getFolderByID(ROOT_FOLDER_ID);
        this.changeFolder(rootFolder);
      }
    }
  },
  methods: {
    focus(focusedDoc) {
      eventHub.$emit('focus', focusedDoc);
    },
    blur(event) {
      eventHub.$emit('blur', event);
    },
    changeFolder(newFolder) {
      this.$emit('changeFolder', newFolder);
    },
  },
  mounted() {
    eventHub.$on('execute', (action, data) => {
      if (action === 'createFolder') {
        this.value = 'Folder';
      } else if (action === 'createFile') {
        this.value = 'File';
      }
    });
  }
};
</script>

<style lang="scss">
@import 'src/assets/styles/variables.scss';
.documents {
  overflow-y: auto;
  height: calc(100vh - #{$file-manager-navbar-height-mobile});
  background-color: $grey-background;

  .folder,
  .file {
    cursor: pointer;
    box-sizing: border-box;
    border: none;
    background-color: transparent;
    padding: 0;

    &:hover {
      background-color: rgba(0,0,0,0.02);
    }

    &:focus {
      background-color: $documents-focus-color;
    }

    p {
      font-family: $font-primary;
    }
  }
}

.iconView {
  padding: 20px;
  box-sizing: border-box;

  .folder-wrapper,
  .file-wrapper {
    margin: 0 30px 20px 0;
    width: 140px;
    height: 140px;
    text-align: center;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  }

  .folder,
  .file   {
    text-align: center;
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;

    img {
      width: 50px;
    }

    p {
      display: block;
      font-size: $documents-name-font-size;
      // position: absolute;
      // top: 15px;
      // left: 0;
      // bottom: 0;
      // right: 0;
      // width: 60px;
      // height: 40px;
      // margin: auto;
      // overflow: auto;
      overflow-wrap: break-word;
    }
  }
}

.listView {
  .col {
    width: 100%;
  }

  .folder,
  .file {
    width: 100%;
    border-bottom: 1px solid $grey-border;
    padding: 8px 18px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
    text-align: left;

    img {
      width: 50px;
    }

    p {
      font-size: $documents-name-font-size;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

@media screen and (min-width: 768px) {
  .documents {
    height: calc(100vh - #{$file-manager-navbar-height});
  }
}
</style>
