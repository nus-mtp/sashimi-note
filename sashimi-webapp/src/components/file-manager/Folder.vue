<template>
  <div class="col vertical-align-child" 
    v-on:dblclick="openFolder"
    v-on:click="focusFolder"
  >
    <button class="folder">
      <img src="../../assets/images/icons/icon-folder.svg" alt="folder">
      <p class="inline-block">{{folder.name}}</p>
    </button>
  </div>
</template>

<script>
  export default {
    props: ['folder'],
    data() {
    },
    methods: {
      openFolder() {
        this.$emit('openFolder', this.folder);
      },
      focusFolder() {
        this.$emit('focusFolder', this.folder);
      }
    },
  };
</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';
</style>
