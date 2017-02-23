<template>
  <div class="section group navbar">
    <div class="col button-back vertical-align-child">
        <button class="navbar-buttons">
          <img src="../../assets/buttons/back-button.png" class="button-img" alt="back">
        </button>
    </div>
    <div class="col float-left vertical-align-child button-margin">
      <div class="image-upload">
        <label for="file-input">
          <img src="../../assets/buttons/upload-image.png" class="button-img" alt="upload-image">
        </label>
        <input type="file" id="file-input">
      </div>
      <button class="navbar-buttons">
        <img src="../../assets/buttons/plugins.png" class="button-img" alt="plugins">
      </button>
      <button class="navbar-buttons">
        <img src="../../assets/buttons/annotate.png" class="button-img" alt="annotate">
      </button>
      <button class="navbar-buttons">
        <img src="../../assets/buttons/share.png" class="button-img" alt="share">
      </button>
    </div>
    <div class="float-right">
      <div class="col vertical-align-child button-margin inline-block">
        <button class="navbar-dropdown navbar-buttons">
          <img src="../../assets/buttons/add.png" alt="add"> New 
        </button>
        <div class="dropdown-content">
          <a href="">New File</a>
          <a href="">Duplicate File</a>
        </div>
        <button class="navbar-dropdown navbar-buttons">
          Manage <img src="../../assets/buttons/add.png" alt="add">
        </button>
        <div class="dropdown-content">
          <a href="">Test</a>
          <a href="">Test</a>
        </div>
      </div>
      <div class="col vertical-align-child button-margin">
        <button class="navbar-buttons">
          <img src="../../assets/buttons/edit.png" class="button-img" alt="editor">
        </button>
        <button class="navbar-buttons">
          <img src="../../assets/buttons/split-view.png" class="button-img" alt="split-view">
        </button>
        <button class="navbar-buttons">
          <img src="../../assets/buttons/viewer.png" class="button-img" alt="viewer">
        </button>
      </div>
      <div class="col vertical-align-child button-margin">
        <button class="navbar-buttons">
          <img src="../../assets/buttons/richtext-dropdown.png" id="richtext-dropdown" alt="dropdown">
        </button>
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style scoped lang="scss"> 
@import '../../assets/styles/variables.scss';

.navbar {
  border-bottom: 1px solid black;
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

  &:hover {
    border: 1px solid black;

    .dropdown-content {
      display:block;
    }
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
