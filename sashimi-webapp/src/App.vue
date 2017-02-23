<template>
  <div id="app" class="container">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',

  resolve: {
    extensions: ['', '.css', '.scss'],
  },
};
</script>

<style lang="scss">
@import 'assets/styles/global-styles.scss';

body {
  margin: 0;
  font-size: 20px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
	-moz-box-sizing: border-box;    /* Firefox, other Gecko */
	box-sizing: border-box;
  color: black;
}

.navbar {
  overflow: hidden;
  box-sizing: border-box;
  padding: 8px 15px;
  text-align: left;
}

button {
  &.navbar-buttons {
    background-color: transparent;
    border: none;
    display: inline-block;
    box-sizing: border-box;
  }

  &.navbar-buttons:focus {
    outline: 0;
  }
}

.button {
  &-left {
    float: left;
  }

  &-right {
    float: right;
  }

  &-back {
    width: $back-button-width;
  }

  &-img {
    width: 38px;
  }
}


.CodeMirror {
  box-shadow: 5px 0 5px -2px #e6e6e6;
  
  .CodeMirror-gutters {
    background-color: white;
  }
}

.CodeMirror.cm-s-base16-dark {
  height: calc(100vh - #{$navbar-height});
}

.CodeMirror-lines {
  overflow-wrap: break-word;
  
  .CodeMirror-code {
    line-height: 1.4em;
    color: #dedede;
    font-family: monospace;
  }
}

vertical-align-elements > * {
  vertical-align: middle;
}

</style>
