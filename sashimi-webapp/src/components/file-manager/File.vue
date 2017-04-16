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
            :class="{ renameError: hasError }"
            :style="renameAnimation"
        v-on:blur="saveFileName"
        v-on:keypress="onKeyPress"
        v-on:keyup="onKeyUp"
        v-on:paste="removeStyle"
      >{{file.name}}</p>
      <!--<input type="text" 
        class="inline-block file-name"
        ref="nameField"
        v-model="file.name"
        v-on:blur="saveFileName"
        v-on:keypress="onKeyPress"
        v-on:keyup="onKeyUp"
        v-on:paste="removeStyle"
      >-->
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
        this.focusFile();
      },
      hasError: false,
      // renameAnimation: {
      //   animation: renameError, '0.2s'
      // }
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
      let newFileName = this.$refs.nameField.innerText;
      newFileName = newFileName.trim().replace(/&nbsp;/gi, '');
      this.file.rename(newFileName)
        .then(() => {
          this.hasError = false;
          window.getSelection().removeAllRanges();
        })
        .catch((error) => {
          this.hasError = true;
          this.$refs.nameField.innerText = this.file.name;
          setTimeout(() => {
            this.hasError = false;
          }, 500);
        });
    },
    onClick(event) {
      event.preventDefault();
      if (this.dblClickCheck(event)) {
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
    dblClickCheck(event) {
      const threshold = 20;
      return (this.onClickDetails.isClickInProgress &&
              (Math.abs(event.x - this.onClickDetails.x) < threshold) &&
              (Math.abs(event.y - this.onClickDetails.y) < threshold));
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
.renameError {
  animation: renameError 0.2s;
}
</style>
