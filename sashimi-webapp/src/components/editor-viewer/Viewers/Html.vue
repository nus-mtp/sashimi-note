<template>
  <iframe 
    id="viewer-container"
    height="100%"
    width="100%"
    frameborder="0"
  ></iframe>
</template>

<script>
  import Vue from 'vue';
  import diagramsRenderer from 'src/logic/renderer/diagrams';
  import iframeBuilder from 'src/helpers/iframeBuilder';

  /**
   * Diagram rendering function for HTML view
   * @param {element} renderTarget - HTML element that will be used to render data into
   * @param {string} htmlData - string containing the parsed and rendered markdown syntax by markdown-it
   */
  function renderUpdate(renderTarget, htmlData) {
    renderTarget.innerHTML = htmlData;
    // find everything and replace/drawsvg
    diagramsRenderer(renderTarget);
  }

  export default {
    props: ['htmlData'],
    data() {
      return {
        renderDoc: null,
      };
    },
    watch: {
      htmlData(data) {
        if (this.renderDoc) {
          renderUpdate(this.renderDoc.body, data);
        }
      }
    },
    mounted() {
      Vue.nextTick(() => {
        iframeBuilder.rebuild(this.$el);
        iframeBuilder.addStyles(this.$el, [
          '/styles/markdown-html.css',
          '/styles/markdown-imports.css'
        ])
        .then(() => {
          this.renderDoc = this.$el.contentWindow.document;
          renderUpdate(this.renderDoc.body, this.htmlData);
        });
      });
    }
  };

</script>

<style lang='scss'>
  #viewer-container {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
