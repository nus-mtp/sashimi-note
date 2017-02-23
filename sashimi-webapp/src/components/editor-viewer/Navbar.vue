<template>
  <div class="section group navbar">
    <div class="col button-back vertical-align-child">
        <a href="/" class="vertical-align-child">
            <!--<img src="../../assets/images/buttons/button-back.svg" class="button-img" alt="back">-->
            <img src="../../assets/sashimi.svg" class="inline-block" alt="sashimi">
            <p class="inline-block">
              SASHIMI NOTE
            </p>
        </a>
    </div>
    <div class="col float-left vertical-align-child button-margin">
      <div class="image-upload">
        <label for="file-input">
          <img src="../../assets/images/buttons/button-upload-image.svg" class="button-img" alt="upload-image">
        </label>
        <input type="file" id="file-input">
      </div>
      <button class="navbar-buttons">
        <img src="../../assets/images/buttons/button-plugins.svg" class="button-img" alt="plugins">
      </button>
      <button class="navbar-buttons">
        <img src="../../assets/images/buttons/button-annotate.svg" class="button-img" alt="annotate">
      </button>
      <button class="navbar-buttons">
        <img src="../../assets/images/buttons/button-share-file.svg" class="button-img" alt="share">
      </button>
    </div>
    <div class="float-right">
      <div class="col inline-block">
        <button class="navbar-dropdown button-margin vertical-align-child navbar-buttons">
          <img class="inline-block" src="../../assets/images/symbols/symbol-add.svg" alt="add"> 
          <p class="inline-block">New</p>  
        </button>
        <div class="dropdown-content">
          <a href="">New File</a>
          <a href="">Duplicate File</a>
        </div>
        <button class="navbar-dropdown button-margin vertical-align-child navbar-buttons">
          <p class="inline-block">Manage</p> 
          <img class="inline-block" src="../../assets/images/symbols/symbol-arrow-down.svg" alt="add">
        </button>
        <div class="dropdown-content">
          <a href="">Test</a>
          <a href="">Test</a>
        </div>
      </div>
      <div class="col vertical-align-child button-margin">
        <button class="navbar-buttons">
          <img src="../../assets/images/buttons/button-edit.svg" class="button-img" alt="editor">
        </button>
        <button class="navbar-buttons">
          <img src="../../assets/images/buttons/button-split-screen.svg" class="button-img" alt="split-view">
        </button>
        <button class="navbar-buttons">
          <img src="../../assets/images/buttons/button-view.svg" class="button-img" alt="viewer">
        </button>
      </div>
      <div class="col vertical-align-child button-margin">
        <button class="navbar-buttons">
          <img src="../../assets/images/buttons/button-richtext-dropdown.svg" id="richtext-dropdown" alt="dropdown">
        </button>
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style scoped lang="scss"> 
@import 'src/assets/styles/variables.scss';

.navbar {
  border-bottom: 1px solid black;
}

.button-back {
  text-align: left;
  position: relative;
  width: 150px;

  a {
    font-size: 14px;
    font-family: $font;
    text-decoration: none;

    &:focus,
    &:visited {
      color: black;
    }

    &:hover {
      color: darkorange;
    }

    img {
      width: 40px;
    }
    
    p {
      margin-left: 5px;
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

.navbar-dropdown {
  font-size: 16px;
  padding: 10px;
  border: 1px solid transparent;

  img {
    width: 20px;
  }

  p {
    margin: 0;
    font-family: $font;
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
