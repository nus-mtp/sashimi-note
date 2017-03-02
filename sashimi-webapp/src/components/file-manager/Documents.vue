<template>
  <div class="group section documents" v-bind:class="view">
    <file :view="action"></file>
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
        iconView: false,
        listView: true
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
  height: calc(100vh - #{$file-manager-navbar-height-mobile});

  .folder, 
  .file {
    cursor: default;
    box-sizing: border-box;
    border: none;
    background-color: transparent;
    padding: 0;

    &:focus {
      background-color: #d3e2e2;
    }

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
      font-family: $general-font;
      position: absolute;
      top: 15px;
      left: 0;
      bottom: 0;
      right: 0;
      width: 60px;
      height: 40px;
      margin: auto;
      overflow: auto;
      overflow-wrap: break-word;
    }
  }
}

.listView {
  .col {
    width: 100%;
  }
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
    text-align: left;

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

@media screen and (min-width: 768px) {
  .documents {
    height: calc(100vh - #{$file-manager-navbar-height});
  }
}
</style>
