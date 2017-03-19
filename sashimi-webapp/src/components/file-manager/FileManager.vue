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
      docs: {}
    };
  },
  watch: {
  },
  methods: {
    changeFolder(newFolder) {
      this.docs = newFolder;
      fileManager.update(this.docs);
      console.log(newFolder);
      this.$router.push({ path: '', query: { folder: newFolder.path } });
      // change directory
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
          this.docs = fileManager.previous();
          break;
        }
        case 'history forward': {
          this.docs = fileManager.next();
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
        default: break;
      }
    },
    downloadDoc(doc) {
      console.log(doc, 'doc');
      doc.load()
      .then((docContent) => {
        this.download(doc, docContent);
      });
    },
    download(doc, docContent) {
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
    }
  },
  mounted() {
    const ROOT_FOLDER_ID = 0;
    this.docs = fileManager.getFolderByID(ROOT_FOLDER_ID);
    fileManager.update(this.docs);
  }
};

</script>

<style scoped lang="scss">
@import 'src/assets/styles/variables.scss';

</style>
