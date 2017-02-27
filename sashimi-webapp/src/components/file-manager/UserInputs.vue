<template>
  <div>
    <div class="section group userInputs navbar vertical-align-child">
      <div class="col button-logo inline-block">
        <router-link to="/" class="vertical-align-child">
          <img src="../../assets/sashimi.svg" class="inline-block" alt="sashimi">
          <p class="inline-block">
            SASHIMI NOTE
          </p>
        </router-link>
      </div>
      <div class="col searchBar inline-block">
        <input type="text" placeholder="Search...">
      </div>
    </div>
    <div class="section group navbar userActions vertical-align-child">
      <div class="col breadcrumb float-left">
        <ul class="navbar-breadcrumb">
          <li><a href="#">Home</a></li>
          <li><a href="#">Blah</a></li>
          <li>Blah</li>
        </ul>
      </div>
      <div class="vertical-align-child float-right">
        <div class="col buttons">
          <button class="navbar-buttons hvr-grow-shadow">
            <img src="../../assets/images/buttons/button-upload-file.svg" class="button-img" alt="delete">
          </button>
          <button class="navbar-buttons hvr-grow-shadow">
            <img src="../../assets/images/buttons/button-add-new.svg" class="button-img" alt="delete">
          </button>
          <button class="navbar-buttons hvr-grow-shadow">
            <img src="../../assets/images/buttons/button-duplicate.svg" class="button-img" alt="delete">
          </button>
          <button class="navbar-buttons hvr-grow-shadow">
            <img src="../../assets/images/buttons/button-download.svg" class="button-img" alt="delete">
          </button>
          <button class="navbar-buttons hvr-grow-shadow">
            <img src="../../assets/images/buttons/button-delete.svg" class="button-img" alt="delete">
          </button>
        </div>
        <div class="col vertical-align-child view ">
          <a href="#"><strong>ICON</strong></a> |
          <a href="#">List</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
};

</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

.userInputs {
  overflow: hidden;
  border-bottom: 1px solid $navbar-border-color;
}

.button-logo {
  width: 100%;
  text-align: center;
  transform: scale(1.2);
}

.searchBar {
  text-align: center;
  width: 100%;
  margin-top: 3px;

  input {
    border: 1px solid $navbar-border-color;
    width: 80%;
    padding: 8px;
    font-family: $general-font;
    font-size: 15px;
  }
}

.userActions {
  background-color: #F7F7F7;
  box-shadow: 0 2px 10px rgba(0,0,0,0.12);
  padding-top: 3px;
  padding-bottom: 3px;
}

.navbar-breadcrumb {
  list-style: none;
  margin-top: 10px;
  font-size: 15px;
  padding-left: 0;

  li {
    display: inline;

    &+li:before {
      padding: 2px;
      color: black;
      content: "/\00a0";
    }

    a {
      text-decoration: underline;

      &:visited {
        color: black;
      }
    }
  }
}

.navbar-buttons {
  img {
    width: 32px;
  }
}

.buttons {
  border-right: 1px solid $navbar-border-color;
}

.view {
  margin-left: 15px;
  a {
    text-decoration: none;

    &:visited {
      color: black;
    }
  }
}

@media screen and (min-width: 768px) {
  .button-logo {
    width: $button-logo-width;
    transform: scale(1);
  }

  .searchBar {
    width: calc(100% - #{$button-logo-width});
  }
}
</style>
