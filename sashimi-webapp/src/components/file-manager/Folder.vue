<template>
  <div class="col folder vertical-align-child" v-on:dblclick="openFolder()" id="123">
    <img src="../../assets/images/icons/icon-folder.svg" alt="folder">
    <p class="inline-block">CS3244 Project dsajdakhdsajkdhaajskdhasjdhasjhdjashdjahdajhdjahdjkahsdajshdjahdjahskajhdksahdkajshdksjahdkajshdsadajshdkajsdas hdjask dakshdjaksd kasdjkashdkjsahdjkhas dhaskjdkjsdjsdjkahskjhsadajk d</p>
  </div>
</template>

<script>
  export default {
    methods: {
      openFolder() {
        const folderId = this.$el.id;
        console.log(folderId);
        this.$router.push({ path: 'content', query: { id: folderId } });
      },
    }
  };
</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

</style>
