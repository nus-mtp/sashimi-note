import unitConverter from 'src/helpers/unitConverter';

export default {
  /**
   * Overwrite existing node's style with the given style
   */
  overwriteStyle: function overwriteStyle(target, source) {
    Object.keys(source).forEach((styleKey) => {
      target[styleKey] = source[styleKey];
    });
  },

  /**
   * Complete the render height of the given page by
   * substracting the page height with the top and bottom
   * paddings
   */
  computeRenderHeight: function computeRenderHeight(page) {
    return parseFloat(unitConverter.get(page.height, 'px'), 10) - (
           parseFloat(unitConverter.get(page.padding.top, 'px'), 10) +
           parseFloat(unitConverter.get(page.padding.bottom, 'px'), 10)
         );
  },

  /**
   * Get computed style of an element.
   * @param {Element} element
   * @return {Object} computerd style object
   */
  getComputedStyle(element) {
    return element.currentStyle || getComputedStyle(element);
  }
};
