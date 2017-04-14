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
  import documentBuilder from 'src/helpers/documentBuilder';
  import elementUtils from 'src/helpers/elementUtils';

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
    props: ['htmlData', 'scrollPosition'],
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
      },
      scrollPosition(position) {
        const codeLines = this.$el.contentWindow.document.getElementsByClassName('code-line');
        let lineStart;
        let lineEnd;
        let codeLineElement = null;
        for (let i = 0; i < codeLines.length; i += 1) {
          codeLineElement = codeLines[i];
          lineStart = codeLineElement.dataset.lineStart;
          lineEnd = codeLineElement.dataset.lineEnd;
          if (lineStart <= position && position <= lineEnd) {
            elementUtils.scrollTo(codeLineElement, 500);
            console.log(codeLineElement, lineStart, lineEnd);
            break;
          }
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
