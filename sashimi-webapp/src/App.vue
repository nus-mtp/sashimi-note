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
@import 'assets/styles/loader.scss';

body {
  margin: 0;
  font-size: 18px;
}

#app {
  font-family: $font;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
	-moz-box-sizing: border-box;    /* Firefox, other Gecko */
	box-sizing: border-box;
  color: black;
}

.float-left {
  float: left;
}

.float-right {
  float: right;
}

.inline-block {
  display: inline-block;
}

.navbar {
  overflow: hidden;
  box-sizing: border-box;
  padding: 8px 20px;
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
  &-margin {
    margin-left: $left-margin-navbar-elements;
  }

  &-img {
    width: 38px;
  }
}

.button-logo {
  text-align: left;
  position: relative;
  width: 150px;

  a {
    font-size: 14px;
    font-family: $font;
    text-decoration: none;

    &:focus,
    &:visited {
      color: black;
    }

    &:hover {
      color: darkorange;
    }

    img {
      width: 40px;
    }
    
    p {
      margin-left: 5px;
    }
  }
}

.CodeMirror {
  box-shadow: 4px 0 12px 0px rgba(0, 0, 0, 0.2);
  
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

.vertical-align-child > * {
  vertical-align: middle;
}

</style>
