<template>
  <div class="group section documents" v-bind:class="view">
    <folder></folder>
    <file></file>
    <file></file>
    <file></file>
    <file></file>
    <file></file>
    <file></file>
    <file></file>
    <file></file>
    <file></file>
  </div>
</template>

<script>
import folder from './Folder';
import file from './File';

export default {
  props: ['action'],
  data() {
    return {
      view: {
        iconView: true,
        listView: false
      },
    };
  },
  watch: {
    action(value) {
      // compute action based on value
      if (value === 'iconView') {
        this.view.iconView = true;
        this.view.listView = false;
      } else {
        this.view.iconView = false;
        this.view.listView = true;
      }
    },
  },
  components: {
    folder,
    file,
  },
};
</script>

<style lang="scss">
@import 'src/assets/styles/variables.scss';
.documents {
  overflow-y: auto;
  height: calc(100vh - #{$file-manager-navbar-height});

  .folder, 
  .file {
    cursor: default;

    p::selection {
      background-color: white;
    }
  }
}

.iconView {
  padding: 20px;
  box-sizing: border-box;

  .folder,
  .file   {
    width: 120px;
    height: 120px;
    text-align: center;
    position: relative;
    margin-right: 30px;

    img {
      width: 120px;
    }

    p {
      font-size: 13px;
      position: absolute;
      top: 15px;
      left: 0;
      bottom: 0;
      right: 0;
      width: 60px;
      height: 40px;
      margin: auto;
      overflow: hidden;
      overflow-wrap: break-word;
    }
  }
}

.listView {

  .folder,
  .file {
    width: 100%;
    border-bottom: 1px solid $navbar-border-color;
    vertical-align: middle;
    padding: 10px 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;

    img {
    width: 50px;
    }
    p {
      font-size: 16px;
      width: 95%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
