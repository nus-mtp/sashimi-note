export default {
  /**
   * Get computed style of an element.
   * @param {Element} element
   * @return {Object} computerd style object
   */
  getComputedStyle(element) {
    return element.currentStyle || getComputedStyle(element);
  },

  /**
   * Overwrite existing node's style with the given style
   */
  overwriteStyle(target, source) {
    source = source || {};
    Object.keys(source).forEach((styleKey) => {
      target[styleKey] = source[styleKey];
    });
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

  hasClass(element, selector) {
    const className = ` ${selector} `;
    if ((` ${element.className} `).replace(/[\n\t\r]/g, ' ').indexOf(className) > -1) {
      return true;
    }
    return false;
  }
};
