<template>
  <div class="group section">
    <folder></folder>
    <file></file>
  </div>
</template>

<script>
import folder from './Folder';
import file from './File';

export default {
  components: {
    folder,
    file,
  },
};
</script>

<style lang="scss">
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
</style>
