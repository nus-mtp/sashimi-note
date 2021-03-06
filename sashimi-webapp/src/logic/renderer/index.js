import elementUtils from 'src/helpers/elementUtils';
import defaultConfig from './defaultConfig';
import renderCore from './core';
import helper from './helper';

/**
 * Constructor for the PageRenderer instance that is used to contain the
 * source HTML and CSS data and the render target's id and page size
 * @param {string|Element} renderDomTarget - Accept either a ID string
 *                                           of a HTML Element or HTML Element reference
 * @param {Object} page - A page config containing information about the page sizing
 * @param {string} page.width - in css width.
 * @param {string} page.height - in css height.
 * @param {Object} page.padding - for setting the inner the padding size used on the page.
 * @param {Array} postProcessingPlugins - an optional array of plugins that contain a `.process` function.
 *                                        These functions are to be executed on the referenceFrame.
 *                                        These functions will receive the referenceFrame object and
 *                                        should return a promise when it is done.
 */
export default function PageRenderer(renderDomTarget, page, postProcessPromiseFns) {
  // Set page sizing. Use default if not provided
  this.page = page || defaultConfig.page;
  this.renderHeight = helper.computeRenderHeight(this.page);

  // Set renderFrame and id
  this.renderDomId = (typeof renderDomTarget === 'string') ? renderDomTarget : 'paginated-view';
  this.renderFrame = elementUtils.resolveElement(renderDomTarget);
  if (!this.renderFrame) {
    throw new Error('Element provided to PageRenderer is not found at this moment');
  }
  this.ownerDocument = renderDomTarget.ownerDocument;

  // Set reference frame
  this.referenceFrame = this.getReferenceFrame();
  this.postProcessPromiseFns = postProcessPromiseFns || [];

  // Set sourceHTML
  this.sourceHTML = null;
}

/**
 * Obtain the reference frame of the rendering instance.
 * The reference frame will be created if it does not exist.
 * The width and padding size of the reference frame will be
 * configured here.
 * @return {Element} referenceFrame - a reference to the reference frame object
 */
PageRenderer.prototype.getReferenceFrame = function getReferenceFrame() {
  const idOfReferenceFrame = defaultConfig.prefix.reference + this.renderDomId;
  let referenceFrame = this.ownerDocument.getElementById(idOfReferenceFrame);

  // Create a new reference frame if doesn't exist
  if (!referenceFrame) {
    referenceFrame = this.ownerDocument.createElement('DIV');
    referenceFrame.setAttribute('id', idOfReferenceFrame);

    // Set reference frame styling by iterate through the refStyle
    const refStyle = {
      // CSS to hide the reference frame from the user
      position: 'absolute',
      top: 0,
      left: '-99999px',
      zIndex: -99999,
      visibility: 'hidden',
      overflow: 'hidden',
      height: 0,
      boxSizing: 'border-box',

      // CSS to set up the page sizing
      width: this.page.width,
      paddingTop: this.page.padding.top,
      paddingBottom: this.page.padding.bottom,
      paddingLeft: this.page.padding.left,
      paddingRight: this.page.padding.right
    };
    helper.overwriteStyle(referenceFrame.style, refStyle);

    // Render reference frame to DOM
    if (!this.ownerDocument.body) {
      throw new Error('Unable to append referenceFrame to document body');
    }
    this.ownerDocument.body.appendChild(referenceFrame);
  }

  return referenceFrame;
};

// Public instance methods
/**
 * Trigger the rendering process of the pageRenderer instance
 * @return {Promise} promise - to indicate the completion of the rendering process
 */
PageRenderer.prototype.render = function render() {
  return renderCore.updateReferenceFrame(this)
  .then(renderCore.getChildHeights)
  .then(childHeights => renderCore.getPaginationVirtualDom(this, childHeights))
  .then(virtualDom => renderCore.renderPage(this, virtualDom));
};

/**
 * Update the HTML content of the page renderer.
 * This will trigger the rendering process.
 * @param {string} htmlString
 * @return {Promise} promise - to indicate the completion of the rendering process
 */
PageRenderer.prototype.write = function write(htmlString) {
  this.sourceHTML = htmlString;
  return this.render();
};

/**
 * Update the page size of the page renderer.
 * This will trigger the rendering process.
 * @param {pageConfig} htmlString
 * @return {Promise} promise - to indicate the completion of the rendering process
 */
PageRenderer.prototype.updatePageSize = function write(pageConfig) {
  this.page = pageConfig;
  this.renderHeight = helper.computeRenderHeight(this.page);
  return this.render();
};
