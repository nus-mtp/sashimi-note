import unitConverter from 'src/helpers/unitConverter';

const defaultConfig = {
  prefix: {
    reference: 'reference-frame-of-',
    className: 'page-view',
  },

  /**
   * Default target page size (Portrait - A4)
   */
  page: {
    width: '21cm',
    height: '29.7cm',
    padding: {
      top: '1.2cm',
      bottom: '1.2cm',
      right: '1.2cm',
      left: '1.2cm'
    }
  }
};

const overwriteStyle = function overwriteStyle(target, source) {
  Object.keys(source).forEach((styleKey) => {
    target[styleKey] = source[styleKey];
  });
};


/**
 * Constructor for the PageRenderer instance that is used to contain the
 * source HTML and CSS data and the render target's id and page size
 * @param {string} renderDomId
 * @param {Object} page - A page config containing information about the page sizing
 * @param {string} page.width - in css width.
 * @param {string} page.height - in css height.
 * @param {Object} page.padding - for setting the inner the padding size used on the page.
 */
export default function PageRenderer(renderDomId, page) {
  // Set page sizing. Use default if not provided
  this.page = page || defaultConfig.page;

  // Set renderFrame and id
  this.renderDomId = renderDomId;
  if (!this.renderDomId) {
    throw new Error('Target DOM id is not provided');
  }
  this.renderFrame = document.getElementById(renderDomId);
  if (!this.renderFrame) {
    throw new Error(`Element with id='${renderDomId}' is not found at this moment`);
  }

  // Set reference frame
  this.referenceFrame = this.getReferenceFrame();

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
  let referenceFrame = document.getElementById(idOfReferenceFrame);

  // Create a new reference frame if doesn't exist
  if (!referenceFrame) {
    referenceFrame = document.createElement('div');
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

      // CSS to set up the page sizing
      width: this.page.width,
      paddingTop: this.page.padding.top,
      paddingBottom: this.page.padding.bottom,
      paddingLeft: this.page.padding.left,
      paddingRight: this.page.padding.right
    };
    overwriteStyle(referenceFrame.style, refStyle);

    // Render reference frame to DOM
    if (!document.body) {
      throw new Error('Unable to append referenceFrame to document body');
    }
    document.body.appendChild(referenceFrame);
  }

  return referenceFrame;
};

// Private methods
/**
 * Render HTML content into a referenceFrame.
 * This function will cause the reflowing of HTML content
 * within the width of the referenceFrame.
 * @return {Promise} promise after the HTML has rendered
 */
const updateReferenceFrame = function updateReferenceFrame(referenceFrame, htmlString) {
  const rf = referenceFrame;
  rf.innerHTML = htmlString;

  // Special check for image loading
  // A similar checking might be needed for external plugin
  return new Promise((resolve, reject) => {
    // TODO: Need to reject promise after timeout
    // in case the images is taking too long to load.

    const imageArray = rf.getElementsByTagName('IMG');
    let countLoadedImage = 0;
    const checkForLoadingCompletion = () => {
      if (countLoadedImage === imageArray.length) {
        resolve(rf);
      }
    };
    const increateLoadedImageCount = () => {
      countLoadedImage += 1;
      checkForLoadingCompletion();
    };
    for (let i = 0; i < imageArray.length; i += 1) {
      // Increment image load count as long as the image is processed.
      imageArray[i].onload = increateLoadedImageCount;
      imageArray[i].onerror = increateLoadedImageCount;
    }
    checkForLoadingCompletion();
  });
};

/**
 * Get the height of all elements inside a referenceFrame.
 * @return {array} childHeights - array containing reference to each elements and its respective height
 */
const getChildHeights = function getChildHeights(referenceFrame) {
  const childNodes = referenceFrame.childNodes;
  const childArray = Object.keys(childNodes).map(key => childNodes[key]);

  const childHeights =
    childArray.filter(childNode => (childNode.nodeName !== '#text'))
              .map((childNode) => {
                const nodeStyle = childNode.currentStyle || getComputedStyle(childNode);

                // Get node's height
                const nodeHeight = Math.max(
                  childNode.clientHeight,
                  childNode.offsetHeight,
                  parseFloat(nodeStyle.height, 10)
                );

                // Get node's margin
                const nodeMargin = parseFloat(nodeStyle.marginTop, 10) +
                                   parseFloat(nodeStyle.marginBottom, 10);

                return ({
                  height: nodeHeight + nodeMargin,
                  ele: childNode
                });
              });

  return childHeights;
};

function VirtualBook() {
  this.pages = [];
}

VirtualBook.prototype.add = function add(page) {
  this.pages.push(page);
};

function VirtualPage(maxHeight) {
  this.maxHeight = maxHeight;
  this.filledHeight = 0;
  this.elements = [];
}
VirtualPage.prototype.add = function add(element) {
  if (element.height / this.maxHeight > 1) {
    throw new Error('Element is larger than page');
  }

  const remainingHeight = this.maxHeight - (element.height + this.filledHeight);

  if (remainingHeight > 0) {
    this.elements.push(element);
    this.filledHeight += element.height;
    return remainingHeight;
  } else {
    throw new Error('Page is full');
  }
};

VirtualPage.prototype.forceAdd = function forceAdd(element) {
  const remainingHeight = this.maxHeight - (element.height + this.filledHeight);
  this.elements.push(element);
  this.filledHeight += element.height;
  return remainingHeight;
};

/**
 * This function will take in an array of elements with their heights information
 * to organise them into an array of page according to the page size specified.
 * @param {PageRenderer} pageRenderer
 * @param {array} childHeights - array containing reference to each elements and its respective height
 * @return {array} virtualBookPages - array of pages containing references to element
 */
const getPaginationVirtualDom = function getPaginationVirtualDom(pageRenderer, childHeights) {
  const pr = pageRenderer;
  const pageSize = pr.page;

  const renderHeight = parseFloat(unitConverter.get(pageSize.height, 'px'), 10) - (
                         parseFloat(unitConverter.get(pageSize.padding.top, 'px'), 10) +
                         parseFloat(unitConverter.get(pageSize.padding.bottom, 'px'), 10)
                       );

  const virtualBook = new VirtualBook();
  let virtualPage = new VirtualPage(renderHeight);

  // Allocate element in pages within the render height
  childHeights.forEach((element, index) => {
    try {
      virtualPage.add(element);
    } catch (error) {
      // Store existing page first
      virtualBook.add(virtualPage);

      if (error.message === 'Element is larger than page') {
        if (virtualPage.filledHeight > 0) {
          // if currently not at the beginning of page,
          // create new page before inserting.
          // TODO: Consider breaking element into smaller chunk
          virtualPage = new VirtualPage(renderHeight);
        }
        virtualPage.forceAdd(element);
      } else if (error.message === 'Page is full') {
        virtualPage = new VirtualPage(renderHeight);
        virtualPage.add(element);
      } else {
        throw error;
      }
    }
  });

  virtualBook.add(virtualPage);
  return virtualBook.pages;
};

/**
 *  Render DOM into the renderFrame of the given pageRenderer
 *  @param {PageRenderer} pageRenderer - to supply page sizing and renderFrame
 *  @param {array} virtualBookPages - array of pages containing references to element
 */
const renderPage = function renderPage(pageRenderer, virtualBookPages) {
  if (!pageRenderer || !virtualBookPages) {
    throw new Error('parameters is null or undefined');
  }
  const pr = pageRenderer;

  // Remove all existing children of renderFrame
  while (pr.renderFrame.firstChild) {
    pr.renderFrame.removeChild(pr.renderFrame.firstChild);
  }

  // Recreate pages for renderFrame
  virtualBookPages.forEach((page) => {
    // Create a new page
    const pageDiv = document.createElement('DIV');
    pageDiv.setAttribute('class', defaultConfig.prefix.className);
    const refStyle = {
      // CSS to set up the page sizing
      width: pr.page.width,
      height: pr.page.height,
      paddingTop: pr.page.padding.top,
      paddingBottom: pr.page.padding.bottom,
      paddingLeft: pr.page.padding.left,
      paddingRight: pr.page.padding.right
    };
    overwriteStyle(pageDiv.style, refStyle);

    pr.renderFrame.appendChild(pageDiv);

    // Put content into the page
    page.elements.forEach((node) => {
      pageDiv.appendChild(node.ele);
    });
  });
};

// Public instance methods
/**
 * Trigger the rendering process of the pageRenderer instance
 * @return {Promise} promise - to indicate the completion of the rendering process
 */
PageRenderer.prototype.render = function render() {
  return updateReferenceFrame(this.referenceFrame, this.sourceHTML)
  .then(getChildHeights)
  .then(childHeights => getPaginationVirtualDom(this, childHeights))
  .then(virtualDom => renderPage(this, virtualDom));
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
  return this.render();
};
