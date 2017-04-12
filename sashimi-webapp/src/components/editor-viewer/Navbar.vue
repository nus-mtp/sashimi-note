<template>
  <div class="section group navbar" v-bind:data-viewMode="viewMode">
    <div class="col button-logo vertical-align-child">
        <router-link to="/" class="vertical-align-child navbar-buttons">
            <img src="../../assets/sashimi-note.svg" class="inline-block" alt="sashimi">
        </router-link>
    </div>
    <!--Waiting for file-manager api to be completed to implement buttons-->
    <!--<div class="col float-left vertical-align-child button-group-margin">
      <div class="image-upload">
        <label for="file-input" class="navbar-buttons" id="upload-image">
          <i class="material-icons md-dark">photo_camera</i>
        </label>
        <input type="file" id="file-input">
      </div>
      <button class="navbar-buttons" id="plugins">
        <img src="../../assets/images/buttons/button-plugins.svg" class="button-img" alt="plugins">
      </button>
      <button class="navbar-buttons" id="annotate">
        <img src="../../assets/images/buttons/button-annotate.svg" class="button-img" alt="annotate">
      </button>
      <button class="navbar-buttons" id="share-file">
        <i class="material-icons md-dark">share</i>
      </button>
    </div>-->
    <div class="float-right">
      <div class="col inline-block">
        <!--Waiting for file-manager api to be completed to implement buttons-->    
        <!--<div class="navbar-dropdown inline-block">
          <button class="button-dropdown button-group-margin vertical-align-child navbar-buttons" id="new-file">
            <img class="inline-block" src="../../assets/images/symbols/symbol-add.svg" alt="add"> 
            <p class="inline-block">New</p>  
          </button>
          <div class="dropdown-content">
            <a href="">New File</a>
            <a href="">Duplicate File</a>
          </div>
        </div>-->
        <div class="navbar-dropdown inline-block">
          <button class="button-dropdown button-group-margin vertical-align-child navbar-buttons" id="manage-file">
            <p class="inline-block">Manage</p> 
            <img class="inline-block" src="../../assets/images/symbols/symbol-arrow-down.svg" alt="add">
          </button>
          <div class="dropdown-content" :data-active="value">
            <input 
              v-model="fileFormat"
              placeholder="File format"
              class="file-format-input-box"
            />
            <button v-on:click="updateParent('pages')" data-format="pages">Pages</button>
            <button v-on:click="updateParent('slides')" data-format="slides">Slides</button>
            <button v-on:click="updateParent('html')" data-format="html">HTML</button>
          </div>
        </div>
      </div>
      <div class="col vertical-align-child button-group-margin">
        <button class="navbar-buttons" id="button-editor"
                v-on:click="updateParent('editor')"
        >
        <i class="material-icons md-dark">edit</i>
        </button>
        <button class="navbar-buttons" id="button-split-screen"
                v-on:click="updateParent('split')"
        >
        <!--<i class="material-icons md-dark">chrome_reader_mode</i>-->
        <i class="material-icons md-dark">chrome_reader_mode</i>
        </button>
        <button class="navbar-buttons" id="button-viewer"
                v-on:click="updateParent('viewer')"
        >
        <i class="material-icons md-dark">remove_red_eye</i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import router from 'src/router';
import condProcessor from 'src/logic/documentPackager/conditionalProcessor';

export default {
  components: {
  },
  data() {
    return {
      isActive: false,
      viewMode: '',
      fileFormat: ''
    };
  },
  props: ['value'],
  watch: {
    fileFormat(data) {
      condProcessor.setFileName(data);
    },
    value(data) {
      this.viewMode = data;
    }
  },
  methods: {
    updateParent(action) {
      this.$emit('input', action);
    },
    goHome() {
      this.$router.push({ path: '/' });
    }
  },
  mounted() {
    if (window.innerWidth < 768) {
      this.viewMode = 'editor';
    } else {
      this.viewMode = 'split';
    }
  }
};
</script>

<style scoped lang="scss"> 
@import 'src/assets/styles/variables.scss';

.navbar {
  box-sizing: border-box;
  border-bottom: 2px solid $navbar-border-color;
  box-shadow: 0px 1px 10px rgba(0,0,0,0.4);
  height: $content-navbar-height;

  &[data-viewMode="editor"], 
  &[data-viewMode="split"] {
    #button-editor, 
    #button-split-screen {
      display: none;
    }
  }

  &[data-viewMode="viewer"] {
    #button-viewer,
    #button-split-screen {
      display: none;
    }
  }
}

.image-upload {
  padding: 2px 6px 3px;
  display: inline-block;

  input {
    display: none;
  }
}

.button-dropdown {
  font-size: $logo-font-size;
  padding: 10px;
  box-sizing: border-box;

  img {
    width: 20px;
  }

  p {
    margin: 0;
    font-family: $font-primary;
  }
}

.navbar-dropdown {
  box-sizing: border-box;
  margin-top: -6px;

  .button-dropdown {
    border: 1px solid transparent;  
    transition: border 0.5s;
    width: $navbar-button-dropdown-width;
  }

  &:hover {
    .button-dropdown {
      transform: scale(1);
      border: 1px solid black;
    }
    .dropdown-content {
      opacity:1;
      visibility: visible;
      transition: opacity 0.5s,
                  visibility 0.5s;
    }
  }
}

.dropdown-content {
  opacity:0;
  visibility: hidden;
  position: absolute;
  width: $navbar-button-dropdown-width;
  box-sizing: border-box;
  border: 1px solid black;
  text-align: left;
  background-color: white;
  z-index: 999;
  margin-left: 18px;
  margin-top: -1px;
  transition: opacity 0.5s,
              visibility 0.5s;

  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-family: $font-primary;
    font-size: $logo-font-size;
    display: block;
    padding: 12px;
    width: 100%;
    text-align: left;

    &:hover {
      background-color: rgba(0,0,0,0.05);
      color: #333;
    }
  }

  // Dropdown button active conditions
  &[data-active="slides"] button[data-format="slides"],
  &[data-active="pages"] button[data-format="pages"],
  &[data-active=""] button[data-format="html"],
  &[data-active="html"] button[data-format="html"] {
    background-color: rgba(0,0,0,0.2);
    font-weight: 600;
  }
  
  // Dropdown input box
  .file-format-input-box {
    width: 100%;
    box-sizing: border-box;
    font-size: 1em;
    padding: 10px;
    padding-left: 10px;
    padding-right: 2px;
  }
}

@media screen and (min-width: 768px) {
  .navbar {
    &[data-viewMode="editor"],
    &[data-viewMode="viewer"],
    &[data-viewMode="split"] {
      #button-split-screen,
      #button-editor,
      #button-viewer {
        display: inline-block;
      }
    }

    &[data-viewMode="editor"] {
      #button-editor {
        .material-icons.md-dark {
          color: $orange;
        }
      }
    }
    &[data-viewMode="split"] {
      #button-split-screen {
        .material-icons.md-dark {
          color: $orange;
        }
      }
    }
    &[data-viewMode="viewer"] {
      #button-viewer {
        .material-icons.md-dark {
          color: $orange;
        }
      }
    }
  }
}
</style>
