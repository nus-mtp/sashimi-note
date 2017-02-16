<template>
  <div id="app" class="container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
@import 'assets/vendors/styles/responsive-grid-system.scss';
$navbar-height: 67px;

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

.no-padding {
  padding: 0;
}

button {
  background-color: transparent;
  border: none;
}

button:focus {
  outline: 0;
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
</style>
