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

  function constructStyleLink(link) {
    const styling = this.renderDoc.createElement('link');
    const attributes = {
      type: 'text/css',
      rel: 'stylesheet',
      href: link
    };

    Object.keys(attributes).forEach((key) => {
      styling.setAttribute(key, attributes[key]);
    });
    return styling;
  }

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

        const styles = [];
        styles.push(constructStyleLink.call(this, '/styles/markdown-html.css'));
        styles.push(constructStyleLink.call(this, '/vendors/katex/katex.min.css'));
        styles.push(constructStyleLink.call(this, '/vendors/highlight.js/styles/ocean.css'));

        styles.forEach((style) => {
          this.renderDoc.head.appendChild(style);
        });
        renderUpdate(this.renderDoc.body, this.htmlData);
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
<style>
