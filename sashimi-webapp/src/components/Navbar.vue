<template>
  <div class="section">
    <div class="navbar">
      <div class="button-back navbar-buttons">
        <button>
          <img src="../assets/buttons/back-button.png" alt="back">
        </button>
      </div>
      <div class="button-userInputs navbar-buttons">
        <div class="image-upload">
          <label for="file-input">
            <img src="../assets/buttons/upload-image.png" alt="upload-image">
          </label>
          <input type="file" id="file-input">
        </div>
        <button>
          <img src="../assets/buttons/plugins.png" alt="plugins">
        </button>
        <button>
          <img src="../assets/buttons/annotate.png" alt="annotate">
        </button>
        <button>
          <img src="../assets/buttons/share.png" alt="share">
        </button>
      </div>
      <div class="space">
        &nbsp;
      </div>
      <div class="button-dropdown navbar-buttons">
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
      <div class="button-editorViewer navbar-buttons">
        <button>
          <img src="../assets/buttons/edit.png" alt="editor">
        </button>
        <button>
          <img src="../assets/buttons/split-view.png" alt="split-view">
        </button>
        <button>
          <img src="../assets/buttons/viewer.png" alt="viewer">
        </button>
      </div>
      <div class="dropdown-richText navbar-buttons">
        <button>
          <img src="../assets/buttons/richtext-dropdown.png" id="richtext-dropdown" alt="dropdown">
        </button>
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss"> 
.navbar {
  clear: both;
  margin: auto;
  overflow: hidden;
  border-bottom: 1px solid black;
  padding: 25px 30px;
  text-align: left;
}

.navbar-buttons {
  float: left;

  img {
    width: 38px;
  }

  #richtext-dropdown {
    margin-top: 8px;
    width: 22px;
  }
}

.button-back {
  width: 55px;
  float: left;
  margin-right: 30px;
}

.button-userInputs {
  width: calc(55px * 4);
  display: inline-block;
}

.button-dropdown {
  width: 250px;
  display: inline-block;

  #dropdown-new {
    float: left;
  }

  #dropdown-manage {
    float: left;
    margin-left: 20px;
  }
}

.button-editorViewer {
  width: calc(55px * 3);
  margin-right: 30px;
}

.space {
  float: left;
  display: inline-block;
  width: calc(100% - 805px);
}

.dropdown-richText {
  width: 55px; 
  clear: right;
}

.image-upload {
  padding: 2px 6px 3px;
  display: inline-block;

  input {
    display: none;
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

</style>
