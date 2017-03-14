<template>
  <div>
    <userInputs 
      v-on:changeViewMode="changeViewMode"
    ></userInputs>
    <documents 
      :view-mode="viewMode"
      :docs="docs"
    ></documents>
  </div>
</template>

<script>
import fileManager from 'src/logic/filemanager';
import documents from './Documents';
import userInputs from './UserInputs';

export default {
  components: {
    documents,
    userInputs,
  },
  data() {
    return {
      viewMode: 'listView',
      docs: ''
    };
  },
  watch: {
  },
  methods: {
    changeViewMode(viewMode) {
      this.viewMode = viewMode;
    },
  },
  mounted() {
    const startPromise = fileManager.start();

    startPromise
    .then((rootFolder) => {
      this.docs = rootFolder;
    })
    .catch((error) => {
      console.log(error);
    });
  }
};

</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

</style>
