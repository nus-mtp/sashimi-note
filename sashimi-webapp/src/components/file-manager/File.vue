<template>
  <div class="col vertical-align-child"
    v-on:dblclick="openFile"
  >
    <button class="file"
            v-on:focus="focusFile"
            v-on:blur="blurFile"
    >
      <img src="../../assets/images/icons/icon-file.svg" alt="file">
      <p class="inline-block">{{file.name}}</p>
    </button>
  </div>
</template>

<script>
export default {
  props: ['file'],
  data() {
  },
  methods: {
    openFile() {
      this.$router.push({ path: 'content', query: { id: this.file.id } });
    },
    focusFile() {
      this.$emit('focusFile', this.file);
    },
    blurFile() {
      this.$emit('blurFile');
    }
  }
};
</script>

<style scoped lang="scss">
</style>
