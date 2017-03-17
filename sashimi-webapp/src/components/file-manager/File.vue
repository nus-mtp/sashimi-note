<template>
  <div class="col vertical-align-child"
    v-on:dblclick="openFile"
  >
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
  }
};
</script>

<style scoped lang="scss">
</style>
