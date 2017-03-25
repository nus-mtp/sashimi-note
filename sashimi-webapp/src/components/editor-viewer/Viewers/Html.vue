<template>
  <iframe 
    id="viewer-container"
    width="100%"
    height="100%"
  ></iframe>
</template>

<script>
  import Vue from 'vue';
  import diagramsRenderer from 'src/logic/renderer/diagrams';

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
        renderUpdate(this.renderDoc.body, data);
      }
    },
    mounted() {
      Vue.nextTick(() => {
        this.renderDoc = this.$el.contentWindow.document;

        const styling = this.renderDoc.createElement('link');
        const attributes = {
          type: 'text/css',
          rel: 'stylesheet',
          href: '/styles/markdown-html.css'
        };

        Object.keys(attributes).forEach((key) => {
          styling.setAttribute(key, attributes[key]);
        });
        this.renderDoc.head.appendChild(styling);
        renderUpdate(this.renderDoc.body, this.htmlData);
      });
    }
  };

</script>
