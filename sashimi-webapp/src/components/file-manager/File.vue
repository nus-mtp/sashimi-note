<template>
  <div class="col vertical-align-child file-wrapper"
    v-on:click="onClick"
  >
    <button class="file"
            v-on:focus="focusFile"
            v-on:blur="blurFile"
    >
      <img src="../../assets/images/icons/icon-file.svg" alt="file">
      <p contenteditable="true" 
        tabindex="2" 
        class="inline-block file-name"
        ref="nameField"
        v-on:blur="saveFileName"
        v-on:keypress="onKeyPress"
        v-on:keyup="onKeyUp"
        v-on:paste="removeStyle"
      >{{file.name}}</p>
    </button>
  </div>
</template>

<script>
export default {
  props: ['file'],
  data() {
    return {
      onClickDetails: {
        x: '',
        y: '',
        isClickInProgress: false
      },
      clearIsClick: () => {
        this.isClickInProgress = false;
      }
    };
  },
  watch: {
  },
  methods: {
    openFile() {
      this.$router.push({ path: 'content', query: { id: this.file.id } });
    },
    focusFile() {
      this.$emit('focusFile', this.file);
    },
    blurFile(event) {
      this.$emit('blurFile', event);
    },
    saveFileName() {
      window.getSelection().removeAllRanges();

      let newFileName = this.$refs.nameField.innerText;
      newFileName = newFileName.trim().replace(/&nbsp;/gi, '');

      this.file.rename(newFileName);
    },
    onClick(event) {
      if (this.onClickDetails.isClickInProgress && event.x === this.onClickDetails.x && event.y === this.onClickDetails.y) {
        this.openFile();
        this.clearIsClick();
        clearTimeout(this.clearIsClick);
      } else {
        this.onClickDetails.x = event.x;
        this.onClickDetails.y = event.y;
        this.onClickDetails.isClickInProgress = true;
        setTimeout(this.clearIsClick, 1000);
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
        this.saveFileName();
        this.$refs.nameField.blur();
      }
    },
    removeStyle(event) {
      event.preventDefault();

      const pastedText = event.clipboardData.getData('text/plain');
      document.execCommand('insertHTML', false, pastedText);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
