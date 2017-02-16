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
  border-right: 1px solid black;
  
  .CodeMirror-gutters {
    background-color: white;
    border-right: 1px solid black;
  }
}

.CodeMirror.cm-s-base16-dark {
  height: calc(100vh - 100px);
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
