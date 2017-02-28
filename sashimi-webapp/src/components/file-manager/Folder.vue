<template>
  <div class="col folder vertical-align-child" v-on:dblclick="openFile()" id="123">
    <button class="button-folder">
      <img src="../../assets/images/icons/icon-folder.svg" alt="folder">
      <p class="inline-block">CS3244 Project dsajdakhdsajkdhaajskdhasjdhasjhdjashdjahdajhdjahdjkahsdajshdjahdjahskajhdksahdkajshdksjahdkajshdsadajshdkajsdas hdjask dakshdjaksd kasdjkashdkjsahdjkhas dhaskjdkjsdjsdjkahskjhsadajk d</p>
    </button>
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
@import 'src/assets/styles/variables.scss';

.button-folder {
  border: none;
  background-color: transparent;
  font-family: $general-font;
  padding: 0;
  z-index: 999;
}
</style>
