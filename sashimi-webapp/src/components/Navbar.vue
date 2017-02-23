<template>
  <div class="section group navbar">
    <div class="col button-back vertical-align-elements">
        <button>
          <img src="../assets/buttons/back-button.png" class="buttons-img" alt="back">
        </button>
    </div>
    <div class="col button-userInputs vertical-align-elements">
      <div class="image-upload">
        <label for="file-input">
          <img src="../assets/buttons/upload-image.png" class="buttons-img" alt="upload-image">
        </label>
        <input type="file" id="file-input">
      </div>
      <button>
        <img src="../assets/buttons/plugins.png" class="buttons-img" alt="plugins">
      </button>
      <button>
        <img src="../assets/buttons/annotate.png" class="buttons-img" alt="annotate">
      </button>
      <button>
        <img src="../assets/buttons/share.png" class="buttons-img" alt="share">
      </button>
    </div>
    <div class="buttons-right vertical-align-elements">
      <div class="col button-dropdown">
        <div id="dropdown-new">
          <button class="navbar-dropdown">
            <img src="../assets/buttons/add.png" alt="add"> New 
          </button>
          <div class="dropdown-content">
            <a href="">New File</a>
            <a href="">Duplicate File</a>
          </div>
        </div>
        <div id="dropdown-manage">
          <button class="navbar-dropdown">
            Manage <img src="../assets/buttons/add.png" alt="add">
          </button>
          <div class="dropdown-content">
            <a href="">Test</a>
            <a href="">Test</a>
          </div>
        </div>
      </div>
      <div class="col button-editorViewer vertical-align-elements">
        <button>
          <img src="../assets/buttons/edit.png" class="buttons-img" alt="editor">
        </button>
        <button>
          <img src="../assets/buttons/split-view.png" class="buttons-img" alt="split-view">
        </button>
        <button>
          <img src="../assets/buttons/viewer.png" class="buttons-img" alt="viewer">
        </button>
      </div>
      <div class="col dropdown-richText vertical-align-elements">
        <button>
          <img src="../assets/buttons/richtext-dropdown.png" id="richtext-dropdown" alt="dropdown">
        </button>
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style scoped lang="scss"> 
@import '../assets/styles/variables.scss';

.navbar {
  clear: both;
  margin: auto;
  overflow: hidden;
  box-sizing: border-box;
  padding: 8px 15px;
  text-align: left;
  border-bottom: 1px solid black;
}

.button-back {
  width: $back-button-width;
}

.button-userInputs {
  float: left;
  margin-left: 30px;
}

.buttons-right {
  float: right;

  .button-editorViewer {
    margin-left: 30px;
  }

  .dropdown-richText {
    margin-left: 30px;
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
  #dropdown-new {
    display: inline-block;
  }

  #dropdown-manage {
    display: inline-block;
  }
}

.navbar-dropdown {
  font-size: 16px;
  padding: 10px;
  border: 1px solid transparent;

  img {
    width: 12px;
    margin-right: 5px;
  }
}

.navbar-dropdown:hover {
  border: 1px solid black;

  .dropdown-content {
    display:block;
  }
}

.dropdown-content {
  display: none;
  position: absolute;
  margin: 15px 15px 0 0;
  min-width: 140px;
  border: 1px solid black;
  text-align: left;
  padding: 10px;
}

#richtext-dropdown {
  margin-top: 8px;
  width: 22px;
}

</style>
