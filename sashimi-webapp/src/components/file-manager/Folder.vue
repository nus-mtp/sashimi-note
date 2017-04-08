<template>
  <div class="col vertical-align-child folder-wrapper" 
    v-on:dblclick="openFolder"
  >
    <button tabindex="1" class="folder"
            v-on:focus="focusFolder"
            v-on:blur="blurFolder"
    >
      <img src="../../assets/images/icons/icon-folder.svg" alt="folder">
      <p contenteditable="true" tabindex="2" class="inline-block"
        v-on:blur="saveFolderName"
        v-on:keypress="onKeyPress"
        v-on:keyup="onKeyUp"
        v-on:paste="removeStyle"
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
      blurFolder(event) {
        this.$emit('blurFolder', event);
      },
      saveFolderName() {
        window.getSelection().removeAllRanges();

        let newFolderName = this.$el.getElementsByTagName('p')[0].innerText;
        newFolderName = newFolderName.trim().replace(/&nbsp;/gi, '');

        this.folder.rename(newFolderName);
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
