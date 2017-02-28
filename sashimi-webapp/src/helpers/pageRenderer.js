import unitConverter from 'src/helpers/unitConverter';

const defaultConfig = {

  prefix: {
    reference: 'reference-frame-of-'
  },

  /**
   * Default target page size
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


/**
 * A PageRenderer instance that is used to contain the
 * source HTML and CSS data and the render target's id and page size
 * @param {string} renderDomId
 * @param {Object} [page] - A page config containing information about the page sizing
 * @param {string} [page.width] - in css width.
 * @param {string} [page.height] - in css height.
 * @param {Object} [page.padding] - for setting the inner the padding size used on the page.
 * @param {string} [page.padding.top] - the css padding top of the page.
 */
/* eslint import/prefer-default-export: 0 */
export function PageRenderer(renderDomId, page) {
  // Use default page sizing if not provided
  this.page = page || defaultConfig.page;

  /**
   * HTML string used for this rendering
   * @type {string}
   */
  this.sourceHTML = null;

  this.renderDomId = renderDomId;
  if (!this.renderDomId) {
    throw new Error('Target DOM id is not provided');
  }

  this.renderFrame = document.getElementById(renderDomId);
  if (!this.renderFrame) {
    throw new Error(`Element with id='${renderDomId}' is not found at this moment`);
  }
  this.referenceFrame = this.getReferenceFrame();
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
    Object.keys(refStyle).forEach((styleKey) => {
      referenceFrame.style[styleKey] = refStyle[styleKey];
    });

    // Render reference frame to DOM
    if (!document.body) {
      throw new Error('Unable to append referenceFrame to document body');
    }
    document.body.appendChild(referenceFrame);
  }

  return referenceFrame;
};

// Static methods
PageRenderer.isPageRenderer = object => object instanceof PageRenderer;

// Private methods
/**
 * @return a promise after html is loaded
 */
const updateReferenceFrame = function updateReferenceFrame(ele, htmlString) {
  ele.innerHTML = htmlString;

  // Special check for image loading
  // A similar checking might be needed for external plugin
  return new Promise((resolve, reject) => {
    // TODO: Need to reject promise after timeout
    // in case the images is taking too long to load.

    const imageArray = ele.getElementsByTagName('img');
    let countLoadedImage = 0;
    const checkForLoadingCompletion = () => {
      if (countLoadedImage === imageArray.length) {
        resolve(ele);
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

const getPaginationVirtualDom = function getPaginationVirtualDom(pageRenderer, eleHeightArray) {
  const pr = pageRenderer;
  const pageSize = pr.page;

  const renderHeight = parseFloat(unitConverter.get(pageSize.height, 'px'), 10) - (
                         parseFloat(unitConverter.get(pageSize.padding.top, 'px'), 10) +
                         parseFloat(unitConverter.get(pageSize.padding.bottom, 'px'), 10)
                       );
  console.log(renderHeight, pageSize.height, pageSize.padding.top, pageSize.padding.bottom);

  const book = new VirtualBook();

  let virtualPage = new VirtualPage(renderHeight);

  // Allocate element in pages within the render height
  eleHeightArray.forEach((element, index) => {
    try {
      virtualPage.add(element);
      console.log(index, 'added', virtualPage.filledHeight, element);
    } catch (error) {
      // Store existing page
      book.add(virtualPage);
      // create a new page

      if (error.message === 'Element is larger than page') {
        if (virtualPage.filledHeight === 0) {
          // if at the beginning of page,
          // don't create new page, just insert
        } else {
          virtualPage = new VirtualPage(renderHeight);
        }
        virtualPage.forceAdd(element);
        console.log(index, 'force', virtualPage.filledHeight, element);
      } else if (error.message === 'Page is full') {
        virtualPage = new VirtualPage(renderHeight);
        virtualPage.add(element);
        console.log(index, 'next', virtualPage.filledHeight, element);
      }
    }
  });

  book.add(virtualPage);
  console.log(book.pages);
  return book.pages;
};

const renderPage = function renderPage(pageRenderer, virtualDom) {
  if (!pageRenderer || !virtualDom) {
    throw new Error('parameters is null or undefined');
  }
  const pr = pageRenderer;
  const containerHolder = document.createElement('DIV');

  virtualDom.forEach((page) => {
    // Create a new page
    const pageDiv = document.createElement('DIV');
    pageDiv.setAttribute('class', 'page-view');
    const refStyle = {
      // CSS to set up the page sizing
      width: pr.page.width,
      height: pr.page.height,
      paddingTop: pr.page.padding.top,
      paddingBottom: pr.page.padding.bottom,
      paddingLeft: pr.page.padding.left,
      paddingRight: pr.page.padding.right
    };
    Object.keys(refStyle).forEach((styleKey) => {
      pageDiv.style[styleKey] = refStyle[styleKey];
    });

    containerHolder.appendChild(pageDiv);

    // Put content into the page
    page.elements.forEach((node) => {
      pageDiv.appendChild(node.ele);
    });
  });

  return containerHolder;
};

const updateRenderer = function updateRenderer() {
  const pr = this;
  if (!PageRenderer.isPageRenderer(pr)) {
    throw new Error('Attempted to call a instance method without an instance');
  }

  updateReferenceFrame(pr.referenceFrame, pr.sourceHTML)
  .then(getChildHeights)
  .then(childHeights => getPaginationVirtualDom(pr, childHeights))
  .then(virtualDom => renderPage(pr, virtualDom))
  .then((virtualDom) => {
    pr.renderFrame.innerHTML = virtualDom.innerHTML;
  });
};

// Public methods
PageRenderer.prototype.write = function write(htmlString) {
  this.sourceHTML = htmlString;
  updateRenderer.apply(this);
};
/**  2. Get elements height
 *    - Collect all elements from the reference frame
 *    - Get the computed height (with margin, padding & border)
 *      of each elements
 *    - Required parameter:
 *        > Access to reference frame
 *
 *  3. Build virtual DOM of pages
 *    - Organise nodes into target page
 *    - Required parameter:
 *        > elements height
 *        > target page height
 *
 *  4. Render DOM into the view
 *    - Required parameter:
 *        > Virtual DOM
 *        > Target id
 */

PageRenderer.prototype.render = function render(htmlString) {
  this.sourceHTML = htmlString;
};

PageRenderer.prototype.updatePageSize = function write(pageConfig) {
  this.page = pageConfig;
};
