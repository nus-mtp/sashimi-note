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
  font-family: $general-font;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
	-moz-box-sizing: border-box;    /* Firefox, other Gecko */
	box-sizing: border-box;
  color: black;
}

img {
  user-drag: none; 
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

:focus {
  outline: 0;
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
  padding: 10px 20px;
  text-align: left;
}

.navbar-buttons {
  background-color: transparent;
  border: none;
  display: inline-block;
  box-sizing: border-box;

  &:focus {
    outline: 0;
  }
  
  &.active {
    transform: scale(1.3);
    -webkit-filter: drop-shadow(1px 1px 2px pink);
    filter: drop-shadow(1px 1px 2px pink);
  }

  &.hvr-grow-shadow {
    box-shadow: none;

    @include navbar-buttons-hover-shadow-color("#upload-image", transparent);
    @include navbar-buttons-hover-shadow-color("#upload-image", #b79ef7);
    @include navbar-buttons-hover-shadow-color("#plugins", #64bcad);
    @include navbar-buttons-hover-shadow-color("#annotate", #ffafe5);
    @include navbar-buttons-hover-shadow-color("#share-file", #7abcf9);
    @include navbar-buttons-hover-shadow-color("#new-file", transparent);
    @include navbar-buttons-hover-shadow-color("#manage-file", transparent);
    @include navbar-buttons-hover-shadow-color("#button-editor", #b570a5);
    @include navbar-buttons-hover-shadow-color("#button-viewer", #5d96b7);
    @include navbar-buttons-hover-shadow-color("#button-split-screen", #a06346);        
  }
}

.button {
  &-group-margin {
    margin-left: $left-margin-navbar-elements;
  }

  &-img {
    width: 38px;
  }
}

.button-logo {
  text-align: left;
  position: relative;
  width: $button-logo-width;

  a {
    font-size: 14px;
    font-family: $general-font;
    text-decoration: none;
    color: #95989A;

    &:focus,
    &:visited {
      color: #95989A;;
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

.vertical-align-child > * {
  vertical-align: middle;
}

</style>
