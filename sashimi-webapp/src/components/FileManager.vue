<template>
  <div>
    <div class="userInputs">
      <div class="search">
        <input type="text" placeholder="Search...">
      </div>
      <div class="toggle-view">
        <button class="">
          <span>ICON</span>
        </button>
        |
        <button>
          <span>List</span>
        </button>
      </div>
    </div>

    <div class="navbar">
      <div class="col button-back">
        <button>
          <img src="../assets/buttons/back-button.png" alt="back">
        </button>      
      </div>
      <div class="col">
        <ul class="breadcrumb">
          <li><a href="#">Home</a></li>
          <li><a href="#">Blah</a></li>
          <li>Blah</li>
        </ul>
      </div>
      
      <div class="navbar-buttons">
        <div class="col file-buttons">
          <button disabled>
            <img src="../assets/buttons/delete-button.svg" alt="delete">
          </button>
          <button disabled>
            <img src="../assets/buttons/duplicate-button.svg" alt="duplicate">
          </button>
          <button disabled>
            <img src="../assets/buttons/download-button.svg" alt="download">
          </button>
        </div>
        <div class="col static-buttons">
          <button>
            <img src="../assets/buttons/add-button.svg" alt="add">
          </button>
          <button>
            <img src="../assets/buttons/upload-button.svg" alt="split-view">
          </button>
          <button>
            <img src="../assets/buttons/filter-button.svg" alt="filter">
          </button>
        </div>
      </div>
    </div>

    <div class="documents">
      <div class="col">

      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
};

</script>

<style scoped lang="scss">
@import '../assets/styles/variables.scss';

.userInputs {
  overflow: hidden;
  text-align: center;
  margin-top: 80px;
  font-size: 20px;
  position: relative;

  input {
    width: 30vw;
    border: 1px solid black;
    font-family: 'Avenir';
  }

  .search {
    position: relative;
  }

  .toggle-view {
    position: absolute;

  }

  span {
    font-family: 'Avenir';
    font-size: 16px;
  }
}

.search {
  display: inline-block;
}

.toggle-view {
  display: inline-block;
}

.navbar {
  padding: 8px 15px;
  margin-top: 20px;
}

.button-back {
  width: $back-button-width;
}

button {
  margin: 0 5px;
}

button:active {

}

ul {
  list-style: none;
  margin-top: 10px;
}

ul.breadcrumb li {
    display: inline;
}

ul.breadcrumb li+li:before {
    padding: 8px;
    color: black;
    content: "/\00a0";
}

.navbar-buttons {
  float: right;
}

button:disabled {
  opacity: 0.2;
}

</style>
