<template>
  <div>
    <userInputs 
      v-on:changeViewMode="changeViewMode"
      v-on:execute="executeAction"
      v-on:changeFolder="changeFolder"
          :folder-path="folderPath"
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

function constructFolderPath(folderObj) {
  // blah
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
      viewMode: 'listView',
      docs: {},
      history: null,
      folderPath: []
    };
  },
  watch: {
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
          break;
        }
        case 'history forward': {
          this.docs = this.history.next();
          this.folderPath = constructFolderPath(this.docs);
          break;
        }
        case 'download': {
          this.download(data);
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
    download(doc) {
      doc.load()
      .then((docContent) => {
        const element = document.createElement('a');
        const href = 'data:text/plain;charset=utf-8,';
        const content = encodeURIComponent(docContent);
        element.setAttribute('href', href+content, docContent);
        const fileName = doc.name;
        element.setAttribute('download', fileName);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      });
    },
    search(searchStr) {
      if (searchStr === '') {
        this.docs = this.history.currFolder;
      } else {
        fileManager.searchAll(searchStr)
        .then((result) => { this.docs = result; })
        .catch((error) => {
          // Simple alert box for message
          // TODO: Use a less obstrusive alert message
          alert('Opps, I have problem finding your file');
          console.log(error);
        });
        // Intentionally not updating the history stack.
        // Since, there may be multiple incomplete searching,
        // updating the history stack may unnecessary populate the stack.
      }
    }
  },
  mounted() {
    const ROOT_FOLDER_ID = 0;
    this.docs = fileManager.getFolderByID(ROOT_FOLDER_ID);
    this.history = fileManager.createHistory(this.docs);
  }
};

</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

</style>
