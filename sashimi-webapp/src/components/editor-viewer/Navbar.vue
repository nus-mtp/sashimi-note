<template>
  <div class="section group navbar">
    <div class="col button-logo vertical-align-child">
        <router-link to="/" class="vertical-align-child navbar-buttons hvr-grow-shadow" id="button-logo">
            <!--<img src="../../assets/images/buttons/button-back.svg" class="button-img" alt="back">-->
            <img src="../../assets/sashimi.svg" class="inline-block" alt="sashimi">
            <p class="inline-block">
              SASHIMI NOTE
            </p>
        </router-link>
    </div>
    <div class="col float-left vertical-align-child button-group-margin">
      <div class="image-upload">
        <label for="file-input" class="navbar-buttons hvr-grow-shadow" id="upload-image">
          <img src="../../assets/images/buttons/button-upload-image.svg" class="button-img" alt="upload-image">
        </label>
        <input type="file" id="file-input">
      </div>
      <button class="navbar-buttons hvr-grow-shadow" id="plugins">
        <img src="../../assets/images/buttons/button-plugins.svg" class="button-img" alt="plugins">
      </button>
      <button class="navbar-buttons hvr-grow-shadow" id="annotate">
        <img src="../../assets/images/buttons/button-annotate.svg" class="button-img" alt="annotate">
      </button>
      <button class="navbar-buttons hvr-grow-shadow" id="share-file">
        <img src="../../assets/images/buttons/button-share-file.svg" class="button-img" alt="share">
      </button>
    </div>
    <div class="float-right">
      <div class="col inline-block">
        <div class="navbar-dropdown inline-block">
          <button class="button-dropdown button-group-margin vertical-align-child navbar-buttons hvr-grow-shadow" id="new-file">
            <img class="inline-block" src="../../assets/images/symbols/symbol-add.svg" alt="add"> 
            <p class="inline-block">New</p>  
          </button>
          <div class="dropdown-content">
            <a href="">New File</a>
            <a href="">Duplicate File</a>
          </div>
        </div>
        <div class="navbar-dropdown inline-block">
          <button class="button-dropdown button-group-margin vertical-align-child navbar-buttons hvr-grow-shadow" id="manage-file">
            <p class="inline-block">Manage</p> 
            <img class="inline-block" src="../../assets/images/symbols/symbol-arrow-down.svg" alt="add">
          </button>
          <div class="dropdown-content">
            <a href="#" v-on:click="updateParent('pages')">Pages</a><br>
            <a href="#" v-on:click="updateParent('slides')">Slides</a><br>
            <a href="#" v-on:click="updateParent('html')">HTML</a><br>
          </div>
        </div>
      </div>
      <div class="col vertical-align-child button-group-margin">
        <button v-on:click="updateParent('editor')" class="navbar-buttons hvr-grow-shadow" id="button-editor">
          <img src="../../assets/images/buttons/button-edit.svg" class="button-img" alt="editor">
        </button>
        <button v-on:click="updateParent('split')" class="navbar-buttons hvr-grow-shadow" id="button-viewer">
          <img src="../../assets/images/buttons/button-split-screen.svg" class="button-img" alt="split-view">
        </button>
        <button v-on:click="updateParent('viewer')" class="navbar-buttons hvr-grow-shadow" id="button-split-screen">
          <img src="../../assets/images/buttons/button-view.svg" class="button-img" alt="viewer">
        </button>
      </div>
      <div class="col vertical-align-child button-group-margin">
        <button class="navbar-buttons hvr-grow-shadow" id="button-richtext-dropdown">
          <img src="../../assets/images/buttons/button-richtext-dropdown.svg" id="richtext-dropdown" alt="dropdown">
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

.dropdown-content {
  display: none;
  position: absolute;
  /*margin: 15px 15px 0 $left-margin-navbar-elements;*/
  min-width: 140px;
  border: 1px solid black;
  text-align: left;
  padding: 10px;
  background-color: white;
}

.navbar-dropdown {
  box-sizing: border-box;

  &:hover {
    border: 1px solid black;

    .button-dropdown {
      font-weight: bold;
    }
    .dropdown-content {
      display:block;
    }
  }
}

#richtext-dropdown {
  margin-top: 8px;
  width: 22px;
}

</style>
