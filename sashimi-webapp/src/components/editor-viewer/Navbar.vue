<template>
  <div class="section group navbar">
    <div class="col button-logo vertical-align-child">
        <a v-on:click="goHome" class="vertical-align-child navbar-buttons hover-grow">        
            <!--<img src="../../assets/images/buttons/button-back.svg" class="button-img" alt="back">-->
            <img src="../../assets/sashimi.svg" class="inline-block" alt="sashimi">
            <p class="inline-block">
              SASHIMI NOTE
            </p>
        </a>
    </div>
    <!--Waiting for file-manager api to be completed to implement buttons-->
    <!--<div class="col float-left vertical-align-child button-group-margin">
      <div class="image-upload">
        <label for="file-input" class="navbar-buttons hover-grow" id="upload-image">
          <i class="material-icons md-dark">photo_camera</i>
        </label>
        <input type="file" id="file-input">
      </div>
      <button class="navbar-buttons hover-grow" id="plugins">
        <img src="../../assets/images/buttons/button-plugins.svg" class="button-img" alt="plugins">
      </button>
      <button class="navbar-buttons hover-grow" id="annotate">
        <img src="../../assets/images/buttons/button-annotate.svg" class="button-img" alt="annotate">
      </button>
      <button class="navbar-buttons hover-grow" id="share-file">
        <i class="material-icons md-dark">share</i>
      </button>
    </div>-->
    <div class="float-right">
      <div class="col inline-block">
        <!--Waiting for file-manager api to be completed to implement buttons-->    
        <!--<div class="navbar-dropdown inline-block">
          <button class="button-dropdown button-group-margin vertical-align-child navbar-buttons hover-grow" id="new-file">
            <img class="inline-block" src="../../assets/images/symbols/symbol-add.svg" alt="add"> 
            <p class="inline-block">New</p>  
          </button>
          <div class="dropdown-content">
            <a href="">New File</a>
            <a href="">Duplicate File</a>
          </div>
        </div>-->
        <div class="navbar-dropdown inline-block">
          <button class="button-dropdown button-group-margin vertical-align-child navbar-buttons hover-grow" id="manage-file">
            <p class="inline-block">Manage</p> 
            <img class="inline-block" src="../../assets/images/symbols/symbol-arrow-down.svg" alt="add">
          </button>
          <div class="dropdown-content" :data-active="value">
            <button v-on:click="updateParent('pages')" data-format="pages">Pages</button>
            <button v-on:click="updateParent('slides')" data-format="slides">Slides</button>
            <button v-on:click="updateParent('html')" data-format="html">HTML</button>
          </div>
        </div>
      </div>
      <div class="col vertical-align-child button-group-margin">
        <button v-on:click="updateParent('editor')" class="navbar-buttons hover-grow" id="button-editor">
        <i class="material-icons md-dark md-dark">edit</i>
        </button>
        <button v-on:click="updateParent('split')" class="navbar-buttons hover-grow" id="button-viewer">
        <!--<i class="material-icons md-dark md-dark">chrome_reader_mode</i>-->
        <img src="../../assets/images/buttons/button-split-screen.svg" class="button-img" alt="plugins">
        </button>
        <button v-on:click="updateParent('viewer')" class="navbar-buttons hover-grow" id="button-split-screen">
        <i class="material-icons md-dark md-dark md-dark">remove_red_eye</i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      isActive: false,
    };
  },
  props: ['value'],
  methods: {
    updateParent(action) {
      this.$emit('input', action);
    },
    goHome() {
      this.$router.push({ path: '/' });
    }
  },
};
</script>

<style scoped lang="scss"> 
@import 'src/assets/styles/variables.scss';

.navbar {
  box-sizing: border-box;
  border-bottom: 3px solid $navbar-border-color;
}

.image-upload {
  padding: 2px 6px 3px;
  display: inline-block;

  input {
    display: none;
  }
}

.button-logo {
  cursor: pointer;
  .hover-grow{
    &:hover {
      transform: scale(1.1);
    }
  }
}

.button-dropdown {
  font-size: $navbar-font-size;
  padding: 10px;
  box-sizing: border-box;

  img {
    width: 20px;
  }

  p {
    margin: 0;
    font-family: $general-font;
  }
}

.navbar-dropdown {
  box-sizing: border-box;

  .button-dropdown {
    border: 1px solid transparent;  
    transition: border 0.5s;
    width: 140px;
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
  width: 140px;
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
    font-family: $general-font;
    font-size: $navbar-font-size;
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
}
</style>
