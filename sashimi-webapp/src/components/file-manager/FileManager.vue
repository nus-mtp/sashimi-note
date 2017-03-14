<template>
  <div>
    <userInputs 
      v-on:changeViewMode="changeViewMode"
      v-on:execute="executeAction"
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
    executeAction(action) {
      if (action === 'createFolder') {
        this.docs.createFolder('Folder');
      } else if (action === 'createFile') {
        this.docs.createFile('File');
      }
    }
  },
  mounted() {
    const startPromise = fileManager.start();

    startPromise
    .then((rootFolder) => {
      console.log(rootFolder);
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
