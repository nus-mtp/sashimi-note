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
    <div class="section group navbar userActions vertical-align-child">
      <div class="col float-left">
        <ul class="navbar-breadcrumb inline-block">
          <li>
            <button class="navbar-buttons hover-grow" 
                    v-on:click="execute('history back')"
            >
              <i class="material-icons">arrow_back</i>
            </button>
          </li>
          <li>
            <button class="navbar-buttons hover-grow" 
                    v-on:click="execute('history forward')"
            >
              <i class="material-icons">arrow_forward</i>
            </button>
            </a>
          </li>
          <li>
            <a href="\">Home</a>
          </li>
        </ul>
      </div>
      <div class="float-right">
        <div class="col vertical-align-child buttons-right inline-block">
          <button id="button-file-upload" class="navbar-buttons hover-grow">
            <i class="material-icons md-dark">file_upload</i>
          </button>
          <button id="button-create-folder" class="navbar-buttons hover-grow" 
                  v-on:click="execute('createFolder')"
          >
            <i class="material-icons md-dark">create_new_folder</i>
          </button>
          <button id="button-create-file" class="navbar-buttons hover-grow" 
                  v-on:click="execute('createFile')"
          >
            <i class="material-icons md-dark">note_add</i>
          </button>
          <button id="button-duplicate" class="navbar-buttons" 
                  v-bind:class="{'hover-grow': buttonEffect}"
          >
            <i class="material-icons md-dark" 
              v-bind:class="{'md-inactive': buttonDisabled}"
            >content_copy</i>
          </button>
          <button id="button-file-download" class="navbar-buttons" 
                  v-bind:class="{'hover-grow': buttonEffect}"
                    v-on:click="execute('download')"
          >
            <i class="material-icons md-dark" 
                v-bind:class="{'md-inactive': buttonDisabled}">file_download</i>
          </button>
          <button id="button-delete" class="navbar-buttons" 
                  v-bind:class="{'hover-grow': buttonEffect}"
                  v-on:click="execute('delete')"
          >
            <i class="material-icons md-dark" 
                v-bind:class="{'md-inactive': buttonDisabled}"
            >delete</i>
          </button>
      </div>
      <div class="col view-type inline-block">
        <button id="button-icon-view" class="navbar-buttons hover-grow" 
                v-on:click="setViewMode('iconView')"
        >Icon</button>|
        <button id="button-list-view" class="navbar-buttons hover-grow" 
                v-on:click="setViewMode('listView')"
        >List</button>
      </div>
    </div>
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
      focusedDoc: {},
    };
  },
  methods: {
    execute(action) {
      eventHub.$emit('execute', action);
      switch (action) {
        case 'delete':
        case 'duplicate':
        case 'download': {
          this.$emit('execute', action, this.focusedDoc);
          break;
        }
        default: {
          this.$emit('execute', action);
        }
      }
    },
    setViewMode(viewMode) {
      this.$emit('changeViewMode', viewMode);
    },
  },
  watch: {},
  mounted() {
    eventHub.$on('focus', (focusedDoc) => {
      this.buttonDisabled = false;
      this.buttonEffect = true;
      this.focusedDoc = focusedDoc;
    });
    eventHub.$on('blur', () => {
      this.buttonDisabled = true;
      this.buttonEffect = false;
    });
  },
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
    font-size: $font-size-secondary;
  }
}

.userActions {
  background-color: $navbar-background-color;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  padding-top: 10px 0;

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
  font-size: $navbar-font-size;
  padding-left: 0;
  margin: 0;

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
