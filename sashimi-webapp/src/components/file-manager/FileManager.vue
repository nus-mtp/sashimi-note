<template>
  <div>
    <userInputs 
      v-on:changeViewMode="changeViewMode"
      v-on:execute="executeAction"
    ></userInputs>
    <documents 
      :viewMode="viewMode"
    ></documents>
  </div>
</template>

<script>
// import fileManager from 'src/logic/filemanager';
import documents from './Documents';
import userInputs from './UserInputs';

// const mockFolder = {
//   id: 0,
//   name: 'root',
//   path: '/',
//   parentFolder: null,
//   childFolderList: [], // list of folders in current folder
//   childFileList: [], // list of files in current folder
// };

export default {
  components: {
    documents,
    userInputs,
  },
  data() {
    return {
      viewMode: 'listView',
    };
  },
  watch: {
  },
  methods: {
    changeViewMode(viewMode) {
      this.viewMode = viewMode;
    },
    executeAction(action) {
      this.$emit('executeAction', action);
    }
  }
  // mounted() {
  //   const startPromise = fileManager.start();

  //   startPromise
  //   .then((rootFolder) => {
  //     console.log(rootFolder, 'rootFolder');
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }
};

</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

</style>
