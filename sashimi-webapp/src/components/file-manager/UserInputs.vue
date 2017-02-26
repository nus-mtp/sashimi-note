<template>
  <div class="section group userInputs">
  <div class="col button-logo vertical-align-child">
    <router-link to="/" class="vertical-align-child">
      <img src="../../assets/sashimi.svg" class="inline-block" alt="sashimi">
      <p class="inline-block">
        SASHIMI NOTE
      </p>
    </router-link>
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

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

.userInputs {
  overflow: hidden;

}
</style>
