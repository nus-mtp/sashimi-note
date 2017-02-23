<template>
  <div class="userInputs">
    <div class="searchBar inline-block">
      <input type="text" placeholder="Search..." @changed="searchInput">
    </div>
    <div class="toggle-view inline-block">
      <button class="navbar-buttons">
        <span>ICON</span>
      </button>
      |
      <button class="navbar-buttons">
        <span>List</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
};

</script>

<style lang="scss">
@import 'src/assets/styles/variables.scss';

.userInputs {
  overflow: hidden;
  text-align: center;
  margin: 60px 0 30px 0;
  position: relative;

  input {
    width: 30vw;
    border: 1px solid black;
    font-family: $font;
    font-size: 18px;
    padding: 8px 10px;
  }

  .searchBar {
  }

  .toggle-view {
    padding: 4px;
  }

  span {
    font-family: $font;
    font-size: 16px;
  }
}
</style>
