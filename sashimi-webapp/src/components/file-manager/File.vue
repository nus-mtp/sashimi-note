<template>
  <div class="col vertical-align-child"
    v-on:dblclick="openFile"
    v-on:click="focusFile($event)">
    <button class="file">
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
    focusFile(event) {
      this.$emit('focusFile', event);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
