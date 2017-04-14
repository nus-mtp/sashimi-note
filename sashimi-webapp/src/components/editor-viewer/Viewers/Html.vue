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

  function scrollIt(destination, duration = 200, easing = 'linear', callback) {
    const easings = {
      linear(t) {
        return t;
      }
    };
    const viewerDoc = destination.ownerDocument;
    const viewWindow = viewerDoc.defaultView;

    const start = viewWindow.pageYOffset;
    const startTime = 'now' in viewWindow.performance ? performance.now() : new Date().getTime();

    const documentHeight = Math.max(viewerDoc.body.scrollHeight, viewerDoc.body.offsetHeight, viewerDoc.documentElement.clientHeight, viewerDoc.documentElement.scrollHeight, viewerDoc.documentElement.offsetHeight);
    const windowHeight = viewWindow.innerHeight || viewerDoc.documentElement.clientHeight || viewerDoc.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

    if ('requestAnimationFrame' in viewWindow === false) {
      scrollIt(destinationOffsetToScroll);
      // viewWindow.scroll(0, destinationOffsetToScroll);
      if (callback) {
        callback();
      }
      return;
    }

    function scroll() {
      const now = 'now' in viewWindow.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, ((now - startTime) / duration));
      const timeFunction = easings[easing](time);
      viewWindow.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

      if (viewWindow.pageYOffset === destinationOffsetToScroll) {
        if (callback) {
          callback();
        }
        return;
      }

      requestAnimationFrame(scroll);
    }

    scroll();
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
            scrollIt(codeLineElement, 500);
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
