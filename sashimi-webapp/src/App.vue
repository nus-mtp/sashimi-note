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
  font-size: $font-size-primary;
}

#app {
  font-family: $font-primary;
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

a {
  color: black;
  text-decoration: none;
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

.span_0_of_12 {
  width: 0;
}

.navbar {
  overflow: hidden;
  box-sizing: border-box;
  padding: 22px 20px 10px 20px;
  text-align: left;
}

.material-icons { 

  &.md-54 { 
    font-size: 54px; 
  }
  &.md-120 { 
    font-size: 120px; 
  }
  &.folder-blue {
    color: #77CBFF;
  }
  &.md-dark {
    color: rgba(0, 0, 0, 0.54); 

    &.md-inactive { 
      color: rgba(0, 0, 0, 0.26); 
    }
  }
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
}

.hover-grow {
  &:hover {
    transform: scale(1.2);
    transition: transform 0.5s;
    -webkit-transition: transform 0.5s;
  }
}

.button {
  &-group-margin {
    margin-left: $navbar-elements-left-margin;
  }

  &-img {
    width: $button-sashimi-width;
  }
}

.button-logo {
  text-align: left;
  position: relative;
  width: $button-logo-width;

  a {
    font-size: $logo-font-size;
    font-family: $font-primary;
    text-decoration: none;
    color: $grey-font;

    &:focus,
    &:visited {
      color: $grey-font;
    }

    &:hover {
      color: $orange;
    }

    img {
      width: 150px;
    }
    
    p {
      margin-left: 5px;
    }
  }
}

.vertical-align-child > * {
  vertical-align: middle;
}

@media screen and (max-width: 480px) {
  .col {
    margin: 0;
  }
}

</style>
