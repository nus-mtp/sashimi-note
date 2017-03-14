<template>
  <div class="col vertical-align-child"
    v-on:dblclick="openFile"
    v-on:click="focusFile($event)">
    <button class="file">
      <img src="../../assets/images/icons/icon-file.svg" alt="file">
      <p class="inline-block">{{fileName}}</p>
    </button>
  </div>
</template>

<script>
export default {
  props: ['fileName'],
  data() {
  },
  methods: {
    openFile() {
      const fileId = this.$el.id;
      this.$router.push({ path: 'content', query: { id: fileId } });
    },
    focusFile(event) {
      this.$emit('focusFile', event);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
