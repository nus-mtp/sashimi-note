<template>
  <div class="col vertical-align-child" 
    v-on:dblclick="openFolder"
  >
    <button class="folder"
            v-on:focus="focusFolder"
            v-on:blur="blurFolder"
    >
      <img src="../../assets/images/icons/icon-folder.svg" alt="folder">
      <p contenteditable="true" tabindex="10" class="inline-block"
        v-on:blur="blurNameInput"
      >{{folder.name}}</p>
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
      },
      blurFolder() {
        this.$emit('blurFolder');
      },
      blurNameInput() {
        this.$emit('blurNameInput');
      }
    },
  };
</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';
</style>
