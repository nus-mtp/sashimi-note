<template>
  <div>
    <div class="userInputs">
      <div class="searchBar inline-block">
        <input type="text" placeholder="Search..." v-bind="searchString">
      </div>
      <div class="toggle-view inline-block">
        <button class="navbar-buttons">
          <span>ICON</span>
        </button>
        |
        <button class="navbar-buttons">
          <span>List</span>
        </button>
      </div>
    </div>

    <div class="navbar">
      <div class="col button-back vertical-align-child">
        <button class="navbar-buttons">
          <img src="../../assets/buttons/back-button.png" class="button-img" alt="back">
        </button>      
      </div>
      <div class="col">
        <ul class="breadcrumb">
          <li><a href="#">Home</a></li>
          <li><a href="#">Blah</a></li>
          <li>Blah</li>
        </ul>
      </div>
      
      <div class="float-right">
        <div class="col vertical-align-child button-margin">
          <button disabled class="navbar-buttons">
            <img src="../../assets/buttons/delete-button.svg" class="button-img" alt="delete">
          </button>
          <button disabled class="navbar-buttons">
            <img src="../../assets/buttons/duplicate-button.svg" class="button-img" alt="duplicate">
          </button>
          <button disabled class="navbar-buttons">
            <img src="../../assets/buttons/download-button.svg" class="button-img" alt="download">
          </button>
        </div>
        <div class="col vertical-align-child">
          <button class="navbar-buttons">
            <img src="../../assets/buttons/add-button.svg" class="button-img" alt="add">
          </button>
          <button class="navbar-buttons">
            <img src="../../assets/buttons/upload-button.svg" class="button-img" alt="split-view">
          </button>
          <button class="navbar-buttons">
            <img src="../../assets/buttons/filter-button.svg" class="button-img" alt="filter">
          </button>
        </div>
      </div>
    </div>

    <div class="group section documents">
      <div class="col folder">
        <img src="../../assets/buttons/folder-icon.svg" alt="folder">
        <p class="inline-block">CS3244 Project</p>
      </div>
      <div class="col file">
        <img src="../../assets/buttons/file-icon.svg" alt="file">
        <p class="inline-block">CS3kjs h</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
};

</script>

<style scoped lang="scss">
@import '../../assets/styles/variables.scss';

.userInputs {
  overflow: hidden;
  text-align: center;
  margin-top: 80px;
  position: relative;

  input {
    width: 30vw;
    border: 1px solid black;
    font-family: $font;
    font-size: 18px;
    padding: 8px 10px;
  }

  .searchBar {
    position: relative;
  }

  .toggle-view {
    position: absolute;
    padding: 4px;
  }

  span {
    font-family: $font;
    font-size: 16px;
  }
}

ul {
  list-style: none;
  margin-top: 10px;

  &.breadcrumb li {
    display: inline;

    &+li:before {
      padding: 8px;
      color: black;
      content: "/\00a0";
    }
  }
}

button:disabled {
  opacity: 0.2;
}

.documents {
  padding: 20px;
  
  img {
    width: 100px;
  }

  p {
    font-size: 14px;
    position: absolute;
    top: 260px;
    padding: 10px;
    height: 30px;
    overflow-wrap: break-word;
    text-overflow: ellipsis;
  }
}

.documents > .folder,
.documents > .file   {
  width: 120px;
  height: 120px;
  text-align: center;
  position: relative;

  img {
    width: 120px;
  }

  p {
    position: absolute;
    top: 15px;
    left: 0;
    bottom: 0;
    right: 0;
    width: 60px;
    height: 40px;
    margin: auto;
    overflow: hidden;
    overflow-wrap: break-word;
  }
}
</style>
