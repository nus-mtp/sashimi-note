<template>
  <div class="navbar">
    <div class="section group userInputs vertical-align-child">
      <div class="col button-logo inline-block">
        <router-link to="/" class="vertical-align-child">
          <img src="../../assets/sashimi-note.svg" class="inline-block" alt="sashimi">
        </router-link>
      </div>
      <!--Waiting for file-manager api to be completed to implement buttons-->
      <div class="col searchBar inline-block vertical-align-child">
        <div class="section group vertical-align-child">

          <i class="col material-icons md-dark">search</i>
          <input
            class="col"
            type="text"
            placeholder="Search"
            v-model="searchString"
            required="required"
            ref="searchInput"
          >
          <button class="col">
            <i class="material-icons md-dark"
                v-on:click="clearSearchString($event)">clear</i>
          </button>
        </div>
      </div>
    </div>
    <div class="section group userActions vertical-align-child">
      <div class="col float-left">
        <button class="navbar-buttons" 
                v-on:click="execute('history back')"
        >
          <i class="material-icons md-dark">arrow_back</i>
        </button>
        <button class="navbar-buttons" 
                v-on:click="execute('history forward')"
        >
          <i class="material-icons md-dark">arrow_forward</i>
        </button>
        <ul class="navbar-breadcrumb inline-block">
          <li v-if="searchString !== ''">
            Search results
          </li>
          <li v-else>
            <router-link to="/">
              Home
            </router-link>
          </li>
          <li v-for="folder in folderPath" v-if="folder.name !== 'root'">
            <router-link :to="{ name: 'fileManager', query: { folder: folder.id } }">
              {{folder.name}}
            </router-link>
          </li>
        </ul>
      </div>
      <div class="float-right">
        <div class="col vertical-align-child buttons-right inline-block">
          <!--Button yet to be implemented. Commented out for deployment-->
          <!--<button id="button-file-upload" class="navbar-buttons">
            <i class="material-icons md-dark">file_upload</i>
          </button>-->
          <button id="button-create-folder" class="navbar-buttons" 
                  v-on:click="execute('createFolder')"
          >
            <i class="material-icons md-dark">create_new_folder</i>
          </button>
          <button id="button-create-file" class="navbar-buttons" 
                  v-on:click="execute('createFile')"
          >
            <i class="material-icons md-dark">note_add</i>
          </button>
          <!--Button yet to be implemented. Commented out for deployment-->
          <!--<button id="button-duplicate" class="navbar-buttons" 
          >
            <i class="material-icons md-dark" 
              v-bind:class="{'md-inactive': buttonDisabled}"
            >content_copy</i>-->
          </button>
          <button id="button-file-download" class="navbar-buttons" 
                    v-on:click="execute('download')"
          >
            <i class="material-icons md-dark" 
                v-bind:class="{'md-inactive': buttonDisabled}">file_download</i>
          </button>
          <button id="button-delete" class="navbar-buttons" 
                  v-on:click="execute('delete')"
          >
            <i class="material-icons md-dark" 
                v-bind:class="{'md-inactive': buttonDisabled}"
            >delete</i>
          </button>
      </div>
      <div class="col view-type inline-block">
        <button id="button-icon-view" class="navbar-buttons" 
                v-on:click="setViewMode('iconView')"
                    :class="{ 'toggle-view-active': iconViewMode }"
        >Icon</button>|
        <button id="button-list-view" class="navbar-buttons" 
                v-on:click="setViewMode('listView')"
                :class="{ 'toggle-view-active': listViewMode }"
        >List</button>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import router from 'src/router';
import eventHub from './EventHub';

let userInputsVue = null;

export default {
  data() {
    return {
      buttonDisabled: true,
      focusedDoc: null,
      holdingDoc: null,
      searchString: '',
      iconViewMode: true,
      listViewMode: false,
    };
  },
  props: ['folderPath', 'viewMode'],
  methods: {
    execute(action) {
      eventHub.$emit('execute', action);
      switch (action) {
        case 'delete':
        case 'duplicate':
        case 'download': {
          if (this.focusedDoc) {
            this.$emit('execute', action, this.focusedDoc);
            this.focusedDoc = null;
          }
          break;
        }
        default: {
          this.$emit('execute', action);
          break;
        }
      }
    },
    setViewMode(viewMode) {
      if (viewMode === 'iconView') {
        this.iconViewMode = true;
        this.listViewMode = false;
      } else {
        this.iconViewMode = false;
        this.listViewMode = true;
      }
      userInputsVue.$emit('changeViewMode', viewMode);
    },
    clearSearchString() {
      this.searchString = '';
    }
  },
  watch: {
    searchString: _.debounce((result) => {
      userInputsVue.$emit('execute', 'search', result);
    }, 500),
    $route() {
      this.searchString = '';
    },
    focusedDoc(theDoc) {
      this.buttonDisabled = Boolean(!theDoc);
    },
    viewMode(mode) {
      this.setViewMode(mode);
    }
  },
  mounted() {
    userInputsVue = this;

    eventHub.$on('focus', (focusedDoc) => {
      this.focusedDoc = focusedDoc;
    });
    eventHub.$on('blur', (event) => {
      const clickTarget = (event.relatedTarget) ? event.relatedTarget.id : null;
      if (!(clickTarget === 'button-delete' || clickTarget === 'button-file-download')) {
        this.focusedDoc = null;
      }
    });
  },
};
</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';
.navbar {
  padding-top: 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  z-index: 999;
  position: relative;
}

.button-logo {
  width: $button-sashimi-width;
  overflow: hidden;
  transform: scale(1.2);
  transition: transform 1s;
  padding: 10px 0;
  text-align: center;
  margin-bottom: 15px;
}

.searchBar {
  width: calc(100% - #{$button-sashimi-width} - #{$searchbar-mobile-margin-left});
  background-color: $grey-background;
  text-align: left;
  margin-left: $searchbar-mobile-margin-left;

  i {
    font-size: 20px;
    padding: 12px;
  }
  
  button {
    background-color: $grey-background;
    border: 0;
    padding: 0;
    box-sizing: border-box;
  }

  input {
    border: none;
    border-radius: 6px;
    background-color: $grey-background;
    width: calc(100% - #{$searchbar-icons-width}*2);
    padding: 13px;
    font-family: $font-primary;
    font-size: 17px;
    box-sizing: border-box;
  }

  input:invalid + button {
    display: none;
  }
}

.userActions {
  /*background-color: $navbar-background-color;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);*/
  padding-top: 15px;
}

.navbar-breadcrumb {
  display: none;
  list-style: none;
  font-size: $navbar-font-size;
  padding-left: 0;
  margin: 0;
  height: 32px;
  vertical-align: middle;

  li {
    display: inline;

    &+li:before {
      padding: 2px;
      color: black;
      content: "/\00a0";
    }

    a {
      &:visited {
        color: black;
      }
    }
  }
}

.navbar-buttons {
  margin: 0 2px;
  height: 32px;
}

.view-type {
  display: none;
  font-size: $navbar-font-size;
  font-family: $font-primary;

  a {
    text-decoration: none;

    &:visited {
      color: black;
    }
  }
}

.toggle-view-active {
    text-transform: uppercase;
    font-weight: bold;
  }

@media screen and (min-width: 480px) {
  .view-type {
    display: inline-block;
    margin-left: 30px;
  }
}

@media screen and (min-width: 768px) {
  .button-logo {
    width: $button-logo-width;
    transform: scale(1);
    overflow: initial;
    margin-bottom: 0;
    margin-top: 5px;
  }

  .searchBar {
    width: 50%;
    margin-left: 40px;
  }

  .userActions  {
    .buttons-right {
      display: inline-block;
    }
  }

  .navbar-breadcrumb {
    display: inline-block;
  }
}
</style>
