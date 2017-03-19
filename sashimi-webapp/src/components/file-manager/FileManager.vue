<template>
  <div>
    <userInputs 
      v-on:changeViewMode="changeViewMode"
      v-on:execute="executeAction"
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

export default {
  components: {
    documents,
    userInputs,
  },
  data() {
    return {
      viewMode: 'listView',
      docs: {},
      history: null
    };
  },
  watch: {
  },
  methods: {
    changeFolder(newFolder) {
      if (newFolder.id === 0) {
        this.$router.push({ path: '' });
      } else {
        this.$router.push({ path: '', query: { folder: newFolder.id } });
      }
      this.docs = newFolder;
      this.history.update(this.docs);
    },
    changeViewMode(viewMode) {
      this.viewMode = viewMode;
    },
    executeAction(action, doc) {
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
          break;
        }
        case 'history forward': {
          this.docs = this.history.next();
          break;
        }
        case 'download': {
          this.downloadDoc(doc);
          break;
        }
        case 'delete': {
          doc.remove();
          break;
        }
        case 'search': {
          if (doc === '') {
            this.docs = this.history.currFolder;
          } else {
            fileManager.searchAll(doc)
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
          break;
        }
        default: break;
      }
    },
    downloadDoc(doc) {
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
