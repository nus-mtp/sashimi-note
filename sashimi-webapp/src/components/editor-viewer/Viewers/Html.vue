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
  import _ from 'lodash';
  import diagramsRenderer from 'src/logic/renderer/diagrams';
  import documentBuilder from 'src/helpers/documentBuilder';
  import elementUtils from 'src/helpers/elementUtils';
  import scrollSync from 'src/logic/inputHandler/scrollSync';

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
        localScrollPosition: null,
        updateScrollPosition: _.throttle((positionToUpdate) => {
          this.localScrollPosition = positionToUpdate;
          this.$emit('updateEditorScrollPosition', positionToUpdate);
        }, 100),
        isBeingScrolled: false,
        checkScroll: (event) => {
          const newLinePosition = scrollSync.getScrollPositionByDocument(this.renderDoc);
          if (newLinePosition != null && !this.isBeingScrolled) {
            this.updateScrollPosition(newLinePosition);
          }
        }
      };
    },
    watch: {
      htmlData(data) {
        if (this.renderDoc) {
          renderUpdate(this.renderDoc.body, data);
        }
      },
      scrollPosition(position) {
        if (Math.abs(this.localScrollPosition - position) < 2) return;
        const elementToScroll = scrollSync.getElementInScrollPosition(position, this.$el.contentWindow.document);
        if (elementToScroll) {
          this.isBeingScrolled = true;
          elementUtils.scrollTo(elementToScroll, 400, () => {
            this.isBeingScrolled = false;
          });
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

          this.$el.contentWindow.addEventListener('scroll', this.checkScroll);
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
