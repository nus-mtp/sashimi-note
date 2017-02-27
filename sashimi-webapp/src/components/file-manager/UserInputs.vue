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
      <div class="col searchBar inline-block">
        <input type="text" placeholder="Search...">
      </div>
    </div>
    <div class="section group navbar userActions">
      <div class="col breadcrumb float-left">
        <ul class="navbar-breadcrumb">
          <li><a href="#">Home</a></li>
          <li><a href="#">Blah</a></li>
          <li>Blah</li>
        </ul>
      </div>
      <div class="col navbar-buttons vertical-align-child float-right">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
};

</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

.userInputs {
  overflow: hidden;
  border-bottom: 1px solid $navbar-border-color;
  padding-top: 20px;
  padding-bottom: 20px;
}

.searchBar {
  text-align: center;
  width: calc(100% - #{$button-logo-width});
  input {
    border: 1px solid $navbar-border-color;
    width: 50vw;
    padding: 10px;
    font-family: $general-font;
  }
}

.userActions {
  background-color: #F7F7F7;
  box-shadow: 0 2px 10px rgba(0,0,0,0.12);
}

.navbar-breadcrumb {
  list-style: none;
  margin-top: 10px;
  font-size: 15px;
  padding-left: 0;

  li {
    display: inline;

    &+li:before {
      padding: 2px;
      color: black;
      content: "/\00a0";
    }

    a {
      text-decoration: none;
      
      &:visited {
        color: #A8A8A8;
      }
    }
  }
}
</style>
