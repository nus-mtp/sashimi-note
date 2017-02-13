<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
@import "assets/vendors/bootstrap-grid";
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;
}

.container {
  padding: 0;
  margin: 0;
  width: 100%;
}

.no-padding {
  padding: 0;
}

.row {
  margin: 0;
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

.CodeMirror.CodeMirror-wrap {
  height: calc(100vh - 100px);
}

.CodeMirror-lines {
  .CodeMirror-code {
    line-height: 1.8em;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
}

.CodeMirror-linenumber.CodeMirror-gutter-elt {
  color: black;
}

.CodeMirror-activeline {
  .CodeMirror-activeline-background {
    background-color: #e6e6e6;
  }
}
</style>
