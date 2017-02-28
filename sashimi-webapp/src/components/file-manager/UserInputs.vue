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
      <table class="col breadcrumb float-left">
        <tr>
          <td>
            <ul class="navbar-breadcrumb">
              <li><a href="#">Home</a></li>
              <li><a href="#">Blah</a></li>
              <li>Blah</li>
            </ul>
          </td>
        </tr>
      </table>
      <table class="vertical-align-child float-right">
        <tr>
          <div class="col buttons">
            <td>
              <button class="navbar-buttons hover-grow">
                <img src="../../assets/images/buttons/button-upload-file.svg" class="button-img" alt="delete">
              </button>
            </td>
            <td>
              <button class="navbar-buttons hover-grow">
                <img src="../../assets/images/buttons/button-add-new.svg" class="button-img" alt="delete">
              </button>
            </td>
            <td>
              <button class="navbar-buttons hover-grow">
                <img src="../../assets/images/buttons/button-duplicate.svg" class="button-img" alt="delete">
              </button>
            </td>
            <td>
              <button class="navbar-buttons hover-grow">
                <img src="../../assets/images/buttons/button-download.svg" class="button-img" alt="delete">
              </button>
            </td>
            <td>
              <button class="navbar-buttons hover-grow">
                <img src="../../assets/images/buttons/button-delete.svg" class="button-img" alt="delete">
              </button>
            </td>
          </div>
          <td>
            <div class="col vertical-align-child view">
              <button class="navbar-buttons hover-grow" v-on:click="setAction('iconView')">Icon</button>|
              <button class="navbar-buttons hover-grow" v-on:click="setAction('listView')">List</button>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  methods: {
    setAction(action) {
      this.$emit('input', action);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

.userInputs {
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  padding-top: 3px;
  padding-bottom: 3px;
}

.navbar-breadcrumb {
  list-style: none;
  margin-top: 10px;
  font-size: $navbar-font-size;
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
  margin: 0 2px; 

  img {
    width: 26px;
  }
}

.buttons {
  border-right: 1px solid $navbar-border-color;
}

.view {
  font-size: $navbar-font-size;

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

    input {
      width: 70%;
    }
  }
}

td {
  vertical-align: middle;
}
</style>
