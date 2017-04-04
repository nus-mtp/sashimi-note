<template>
  <div class="col vertical-align-child file-wrapper"
    v-on:dblclick="openFile"
  >
    <button class="file"
            v-on:focus="focusFile"
            v-on:blur="blurFile"
    >
      <img src="../../assets/images/icons/icon-file.svg" alt="file">
      <p contenteditable="true" tabindex="2" class="inline-block"
        v-on:blur="saveFileName"
        v-on:keypress="onKeyPress($event)"
        v-on:keyup="onKeyUp($event)"
        v-on:paste="removeStyle($event)"
      >{{file.name}}</p>
    </button>
  </div>
</template>

<script>
export default {
  props: ['file'],
  data() {
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

      let newFileName = this.$el.getElementsByTagName('p')[0].innerHTML;
      newFileName = newFileName.trim().replace(/&nbsp;/gi, '');

      if (newFileName === '') {
        newFileName = 'untitled.md';
      }

      if (newFileName !== this.file.name) {
        this.$emit('renameFile', newFileName, this.file);
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
