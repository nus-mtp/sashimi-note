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
  import DiagramsRenderer from 'src/logic/renderer/diagrams';
  import documentBuilder from 'src/helpers/documentBuilder';

  /**
   * Diagram rendering function for HTML view
   * @param {element} renderTarget - HTML element that will be used to render data into
   * @param {string} htmlData - string containing the parsed and rendered markdown syntax by markdown-it
   */

  export default {
    props: ['htmlData'],
    data() {
      return {
        diagramsRenderer: null,
        renderDoc: null,
      };
    },
    watch: {
      htmlData(data) {
        if (this.renderDoc) {
          this.renderDoc.body.innerHTML = this.htmlData;
          this.diagramsRenderer.process(this.renderDoc.body);
        }
      }
    },
    mounted() {
      Vue.nextTick(() => {
        documentBuilder.rebuild(this.$el);
        documentBuilder.addStyles(this.$el, [
          '/styles/markdown-html.css',
          '/styles/markdown-imports.css'
        ])
        .catch((error) => {
          /* eslint no-console: 0 */
          if (error.message.includes('Error loading style')) {
            // Disregard loading error and continue to render document.
            console.error(error.message);
          } else {
            throw error;
          }
        })
        .then(() => {
          this.renderDoc = this.$el.contentWindow.document;
          this.renderDoc.body.innerHTML = this.htmlData;
          this.diagramsRenderer = new DiagramsRenderer();
          this.diagramsRenderer.render(this.renderDoc.body);
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
