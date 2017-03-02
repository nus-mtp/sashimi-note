<template>
  <div class="col vertical-align-child" 
    v-on:dblclick="openFolder"
    id="123">
      <button class="folder">
        <img src="../../assets/images/icons/icon-folder.svg" alt="folder">
        <p class="inline-block">CS3244 Project dsajdakhdsajkdhaajskdhasjdhasjhdjashdjahdajhdjahdjkahsdajshdjahdjahskajhdksahdkajshdksjahdkajshdsadajshdkajsdas hdjask dakshdjaksd kasdjkashdkjsahdjkhas dhaskjdkjsdjsdjkahskjhsadajk d</p>
      </button>
  </div>
</template>

<script>
  export default {
    data() {
    },
    methods: {
      openFolder() {
        const folderId = this.$el.id;
        this.$router.push({ path: 'content', query: { id: folderId } });
      },
    }
  };
</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';
</style>
