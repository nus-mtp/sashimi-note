<template>
  <div>
    <userInputs 
      v-on:changeViewMode="changeViewMode"
      v-on:execute="executeAction"
          :folder-path="folderPath"
          :view-mode="viewMode"
    ></userInputs>
    <documents 
      v-on:changeFolder="changeFolder"
          :view-mode="viewMode"
          :docs="docs"
    ></documents>
  </div>
</template>

<script>
import fileManager from 'src/logic/filemanager';
import documents from './Documents';
import userInputs from './UserInputs';

let fileManagerVue = this;

function constructFolderPath(folderObj) {
  const folderPath = [];

  folderPath.push(folderObj);
  while (folderObj.parentFolder !== null) {
    folderPath.push(folderObj.parentFolder);
    folderObj = folderObj.parentFolder;
  }

  return folderPath.reverse();
}

export default {
  components: {
    documents,
    userInputs,
  },
  data() {
    return {
      viewMode: 'iconView',
      docs: {},
      history: null,
      folderPath: [],
      changeDocViewOnResize: function() {
        if (window.innerWidth < 480) {
          this.viewMode = 'listView';
        }
      }
    };
  },
  watch: {
    $route(path) {
      if (path.query.folder === undefined) {
        const ROOT_FOLDER_ID = 0;
        const rootFolder = fileManager.getFolderByID(ROOT_FOLDER_ID);
        this.changeFolder(rootFolder);
      } else {
        const folderID = path.query.folder;
        const currFolder = fileManager.getFolderByID(folderID);
        this.changeFolder(currFolder);
      }
    }
  },
  methods: {
    changeFolder(folderObj) {
      this.folderPath = constructFolderPath(folderObj);
      this.updateUrlPath(folderObj);
      this.docs = folderObj;
      try {
        this.history.update(this.docs);
      } catch (error) {
        if (error.message === 'Attempting to update the same folder') {
          return;
        }
        throw error;
      }
    },
    changeViewMode(viewMode) {
      this.viewMode = viewMode;
    },
    updateUrlPath(folderObj) {
      if (folderObj.id === 0) {
        this.$router.push({ path: '' });
      } else {
        this.$router.push({ path: '', query: { folder: folderObj.id } });
      }
    },
    executeAction(action, data) {
      switch (action) {
        case 'createFolder': {
          this.docs.createFolder('Folder');
          break;
        }
        case 'createFile': {
          this.docs.createFile('File');
          break;
        }
        case 'history back': {
          this.docs = this.history.previous();
          this.folderPath = constructFolderPath(this.docs);
          this.updateUrlPath(this.docs);
          break;
        }
        case 'history forward': {
          this.docs = this.history.next();
          this.folderPath = constructFolderPath(this.docs);
          this.updateUrlPath(this.docs);
          break;
        }
        case 'download': {
          data.download();
          break;
        }
        case 'delete': {
          data.remove();
          break;
        }
        case 'search': {
          this.search(data);
          break;
        }
        default: break;
      }
    },
    search(searchStr) {
      if (searchStr === '') {
        const folderID = this.history.currFolderID;
        this.docs = fileManager.getFolderByID(folderID);
      } else {
        fileManager.searchAll(searchStr)
        .then((result) => { this.docs = result; })
        .catch((error) => {
          // Simple alert box for message
          // TODO: Use a less obstrusive alert message
        });
        // Intentionally not updating the history stack.
        // Since, there may be multiple incomplete searching,
        // updating the history stack may unnecessary populate the stack.
      }
    }
  },
  mounted() {
    fileManagerVue = this;

    const ROOT_FOLDER_ID = 0;
    const folderID = this.$route.query.folder;

    if (folderID) {
      this.docs = fileManager.getFolderByID(folderID);
      this.folderPath = constructFolderPath(this.docs);
    } else {
      this.docs = fileManager.getFolderByID(ROOT_FOLDER_ID);
    }
    this.history = fileManager.createHistory(this.docs);

    this.changeDocViewOnResize();
    window.addEventListener('resize', this.changeDocViewOnResize.bind(fileManagerVue));
  },
  beforeDestroy() {
    fileManagerVue = this;

    window.removeEventListener('resize', this.changeDocViewOnResize.bind(fileManagerVue));
  }
};

</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

</style>
