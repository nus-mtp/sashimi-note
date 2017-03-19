<template>
  <div class="col vertical-align-child" 
    v-on:dblclick="openFolder"
  >
    <button tabindex="1" class="folder"
            v-on:focus="focusFolder"
            v-on:blur="blurFolder"
    >
      <img src="../../assets/images/icons/icon-folder.svg" alt="folder">
      <p contenteditable="true" tabindex="2" class="inline-block"
        v-on:blur="blurNameInput"
        v-on:keypress="onKeyPress($event)"
        v-on:keyup="onKeyUp($event)"
            :id="folder.id"
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
        this.saveFolderName();
        window.getSelection().removeAllRanges();
      },
      saveFolderName() {
        let newFolderName = document
                                .getElementById(this.folder.id)
                                .innerHTML
                                .trim().replace(/&nbsp;/gi, '');
        if (newFolderName === '') {
          newFolderName = 'untitled';
        }
        this.$emit('renameFolder', { newFolderName, folderToRename: this.folder });
      },
      onKeyPress(event) {
        const enterKey = 13;
        if (event.keyCode === enterKey) {
          event.preventDefault();
        }
      },
      onKeyUp(event) {
        const enterKey = 13;
        if (event.keyCode === enterKey) {
          this.blurNameInput();
        }
      }
    },
  };
</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';
</style>
