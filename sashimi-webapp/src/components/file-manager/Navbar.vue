<template>
  <div class="section group navbar">
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
          <img src="../../assets/images/buttons/button-delete.svg" class="button-img" alt="delete">
        </button>
        <button disabled class="navbar-buttons">
          <img src="../../assets/images/buttons/button-duplicate.svg" class="button-img" alt="duplicate">
        </button>
        <button disabled class="navbar-buttons">
          <img src="../../assets/images/buttons/button-download.svg" class="button-img" alt="download">
        </button>
      </div>
      <div class="col vertical-align-child">
        <button class="navbar-buttons">
          <img src="../../assets/images/buttons/button-add-new.svg" class="button-img" alt="add">
        </button>
        <button class="navbar-buttons">
          <img src="../../assets/images/buttons/button-upload-file.svg" class="button-img" alt="split-view">
        </button>
        <button class="navbar-buttons">
          <img src="../../assets/images/buttons/button-filter.svg" class="button-img" alt="filter">
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  
</script>

<style scoped lang="scss">
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
</style>
