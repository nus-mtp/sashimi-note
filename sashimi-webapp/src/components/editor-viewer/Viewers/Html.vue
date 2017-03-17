<template>
  <div id="viewer-container"></div>
</template>

<script>
  import diagramsRenderer from 'src/logic/renderer/diagrams';

  /**
   * Diagram rendering function for HTML view
   * @param {string} htmlData - string containing the parsed and rendered markdown syntax by markdown-it
   */
  function renderUpdate(htmlData) {
    document.getElementById('viewer-container').innerHTML = htmlData;
    // find everything and replace/drawsvg
    diagramsRenderer(document.getElementById('viewer-container'));
  }

  export default {
    props: ['htmlData'],
    watch: {
      htmlData() {
        renderUpdate(this.htmlData);
      }
    },
    mounted() {
      renderUpdate(this.htmlData);
    }
  };

</script>
