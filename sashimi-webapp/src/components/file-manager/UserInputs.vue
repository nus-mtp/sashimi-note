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
      <!--Waiting for file-manager api to be completed to implement buttons-->
      <div class="col searchBar inline-block">
        <input type="text" placeholder="Search...">
      </div>
    </div>
    <div class="navbar userActions vertical-align-child">
      <table>
        <tr>
          <td class="breadcrumb float-left">
            <ul class="navbar-breadcrumb">
              <li><a href="\">Home</a></li>
            </ul>
          </td>
            <!--Waiting for file-manager api to be completed to implement buttons-->
            <div class="float-right">
              <div class="vertical-align-child buttons-right inline-block">
                <td>
                  <button class="navbar-buttons hover-grow">
                    <i class="material-icons md-dark">file_upload</i>
                  </button>
                </td>
                <td>
                  <button class="navbar-buttons hover-grow" v-on:click="execute('createFolder')">
                    <i class="material-icons md-dark">create_new_folder</i>
                  </button>
                </td>
                <td>
                  <button class="navbar-buttons hover-grow" v-on:click="execute('createFile')">
                    <i class="material-icons md-dark">note_add</i>
                  </button>
                </td>
                <td>
                  <button class="navbar-buttons" v-bind:class="{'hover-grow': buttonEffect}">
                  <i class="material-icons md-dark" v-bind:class="{'md-inactive': buttonDisabled}">content_copy</i>
                  </button>
                </td>
                <td>
                  <button class="navbar-buttons" v-bind:class="{'hover-grow': buttonEffect}">
                    <i class="material-icons md-dark" v-bind:class="{'md-inactive': buttonDisabled}">file_download</i>
                  </button>
                </td>
                <td>
                  <button class="navbar-buttons" v-bind:class="{'hover-grow': buttonEffect}">
                    <i class="material-icons md-dark" v-bind:class="{'md-inactive': buttonDisabled}">delete</i>
                  </button>
                </td>
              </div>
              <div class="view-type inline-block">
                <td class="vertical-align-child">
                  <button class="navbar-buttons hover-grow" v-on:click="setViewMode('iconView')">Icon</button>|
                  <button class="navbar-buttons hover-grow" v-on:click="setViewMode('listView')">List</button>
                </td>
              </div>
            </div>
          </tr>
      </table>
    </div>
  </div>
</template>

<script>
import eventHub from './EventHub';

export default {
  data() {
    return {
      buttonDisabled: true,
      buttonEffect: false,
    };
  },
  methods: {
    execute(action) {
      eventHub.$emit('execute', action);
    },
    setViewMode(viewMode) {
      this.$emit('changeViewMode', viewMode);
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
    font-family: $font-primary;
    font-size: 15px;
  }
}

.userActions {
  background-color: $navbar-background-color;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  padding-top: 3px;
  padding-bottom: 3px;

  table {
    width: 100%;
    
    td {
      vertical-align: middle;
    }
  }
}

.buttons-right {
  display: none;

  td {
    width: $button-img-width;
  }
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
}

.view-type {
  font-size: $navbar-font-size;

  a {
    text-decoration: none;

    &:visited {
      color: black;
    }
  }

  td {
    width: 100px;
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

  .userActions  {
    .buttons-right {
      display: inline-block;
      border-right: 1px solid $navbar-border-color;
    }
  }
}
</style>
