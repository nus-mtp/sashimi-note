import unitConverter from 'src/helpers/unitConverter';

export default {
  /**
   * Overwrite existing node's style with the given style
   */
  overwriteStyle(target, source) {
    Object.keys(source).forEach((styleKey) => {
      target[styleKey] = source[styleKey];
    });
  },

  /**
   * Complete the render height of the given page by
   * substracting the page height with the top and bottom
   * paddings
   */
  computeRenderHeight(page) {
    return unitConverter.get(page.height, 'px', false) - (
           unitConverter.get(page.padding.top, 'px', false) +
           unitConverter.get(page.padding.bottom, 'px', false)
         );
  },

  computeElementHeight(element) {
    const nodeStyle = this.getComputedStyle(element);

    // Get node's height
    const nodeStyleHeight = parseFloat(nodeStyle.height, 10) || 0;
    const nodeHeight = Math.max(
      element.clientHeight,
      element.offsetHeight,
      nodeStyleHeight
    );

    // Get node's margin
    const nodeMargin = parseFloat(nodeStyle.marginTop, 10) +
                      parseFloat(nodeStyle.marginBottom, 10);

    const totalHeight = nodeHeight + nodeMargin;
    if (isNaN(totalHeight)) {
      throw new Error('Error calculating element\'s height');
    }

    return totalHeight;
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
