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
        v-on:blur="saveFolderName"
        v-on:keypress="onKeyPress($event)"
        v-on:keyup="onKeyUp($event)"
        v-on:paste="removeStyle($event)"
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
      saveFolderName() {
        window.getSelection().removeAllRanges();

        let newFolderName = this.$el.getElementsByTagName('p')[0].innerHTML;
        newFolderName = newFolderName.trim().replace(/&nbsp;/gi, '');
        if (newFolderName === '') {
          newFolderName = 'untitled';
        }

        if (newFolderName !== this.folder.name) {
          this.$emit('renameFolder', newFolderName, this.folder);
        }
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
          this.saveFolderName();
        }
      },
      removeStyle(event) {
        event.preventDefault();

        const pastedText = event.clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, pastedText);
      }
    },
  };
</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';
</style>
