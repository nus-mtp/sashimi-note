<template>
  <div id='viewer-floater'>
    <ul>
      <a
        v-on:click="goFullScreen"
      >
        Go fullscreen
      </a>
    </ul>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    data() {
      return {};
    },
    methods: {
      goFullScreen() {
        alert('what?');
      }
    },
    mounted() {}
  };

</script>

<style scoped lang="scss">

// Floater body and interaction styling
#viewer-floater {
  opacity: 0.6;
  position: fixed;
  height: 240px;
  width: 240px;
  background: grey;
  bottom: 0;
  right: 0;
  transition: opacity 1s;
  z-index: 10;

  &:hover {
    transition: opacity 1s;
    opacity: 1;
  }
}

// Floater content's styling
#viewer-floater {
  button {
    border-radius: 50%;
  }
}
</style>
