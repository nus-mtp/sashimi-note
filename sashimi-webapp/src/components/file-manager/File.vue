<template>
  <div class="col file vertical-align-child" v-on:dblclick="openFile()" id="123">
    <img src="../../assets/images/icons/icon-file.svg" alt="file">
    <p class="inline-block">CS3kjs h</p>
  </div>
</template>

<script>
export default {
  methods: {
    openFile() {
      const fileId = this.$el.id;
      console.log(fileId);
      this.$router.push({ path: 'content', query: { id: fileId } });
    },
  }
};
</script>

<style scoped lang="scss">
</style>
