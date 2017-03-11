import VirtualBook from './VirtualBook';
import helper from './helper';

const CLASS_NAME_PREFIX = 'page-view';

const constructChildHeightsArray = function constructChildHeightsArray(childNodes) {
  const childArray = Object.keys(childNodes).map(key => childNodes[key]);
  const childHeights =
    childArray.filter(childNode => (childNode.nodeName !== '#text'))
              .map((childNode) => {
                const totalHeight = helper.computeElementHeight(childNode);

                // Add debug infomation into the dom element
                childNode.pageRenderer = { totalHeight };

                return ({
                  height: totalHeight,
                  ele: childNode
                });
              });
  return childHeights;
};

// Setting up page-break-before mechanism
// These page-break-before are hardcoded for now.
// TODO: Refactor this code
const checkShouldPageBreak = function checkShouldPageBreak(childHeights, index) {
  const BREAK_PAGE = true;
  const DO_NOTHING = false;

  const element = childHeights[index].ele;
  const eleName = element.tagName;

  switch (eleName) {
    case 'H1': {
      // If this H1 is at the beginning of the page, do not break
      if (index === 0) {
        return DO_NOTHING;
      } else {
        return BREAK_PAGE;
      }
    }
    case 'H2': {
      // If a H2 was immediately preceeded by H1,
      // then, this H2 will not have a page-before-break
      if (childHeights[index - 1] &&
          childHeights[index - 1].ele.tagName === 'H1') {
        return DO_NOTHING;
      } else {
        return BREAK_PAGE;
      }
    }
    case 'BR': {
      // Special break page syntax on <br page>
      return (element.getAttribute('page') === '');
    }
    default: {
      const eleStyles = helper.getComputedStyle(element);
      return eleStyles.pageBreakBefore === 'always';
    }
  }
};

const addElementToPage = function addElementToPage(element, page, book, eleArray, index) {
  try {
    if (checkShouldPageBreak(eleArray, index)) {
      // Create a new page if page should be broken here
      page = book.newPage();
    }

    page.add(element);
  } catch (error) {
    if (error.message === 'Element is larger than page') {
      if (page.filledHeight > 0) {
        // if currently not at the beginning of page,
        // create new page before inserting.
        // TODO: Consider breaking element into smaller chunk
        page = book.newPage();
      }
      page.forceAdd(element);
    } else if (error.message === 'Page is full') {
      page = book.newPage();
      page = addElementToPage(element, page, book, eleArray, index);
    } else {
      throw error;
    }
  }
  return page;
};

export default {
  /**
   * Render pageRenderer's HTML content into its referenceFrame.
   * This function will cause the reflowing of HTML content
   * within the width of the referenceFrame.
   * @return {Promise} promise after the HTML has rendered
   */
  updateReferenceFrame: function updateReferenceFrame(pageRenderer) {
    const rf = pageRenderer.referenceFrame;
    rf.innerHTML = pageRenderer.sourceHTML;

    // Additional element styling
    const imgElements = rf.getElementsByTagName('IMG');
    for (let i = 0; i < imgElements.length; i += 1) {
      helper.overwriteStyle(imgElements[i].style, {
        maxWidth: '100%',
        maxHeight: `${pageRenderer.renderHeight}px`
      });
    }

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

        // Handle case where image does not have a src attribute
        if (!imageArray[i].getAttribute.src) increateLoadedImageCount();
      }
      checkForLoadingCompletion();
    });
  },

  /**
   * Get the height of all elements inside a referenceFrame.
   * @return {array} childHeights - array containing reference to each elements and its respective height
   */
  getChildHeights: function getChildHeights(referenceFrame) {
    const childNodes = referenceFrame.childNodes;
    return constructChildHeightsArray(childNodes);
  },

  /**
   * This function will take in an array of elements with their heights information
   * to organise them into an array of page according to the page size specified.
   * @param {PageRenderer} pageRenderer
   * @param {array} childHeights - array containing reference to each elements and its respective height
   * @return {array} virtualBookPages - array of pages containing references to element
   */
  getPaginationVirtualDom: function getPaginationVirtualDom(pageRenderer, childHeights) {
    const pr = pageRenderer;

    // Create a new book and insert a page into the book
    const virtualBook = new VirtualBook(pr.renderHeight);
    let virtualPage = virtualBook.newPage();

    // Allocate element in pages within the render height
    childHeights.forEach((element, index) => {
      virtualPage = addElementToPage(element, virtualPage, virtualBook, childHeights, index);
    });

    return virtualBook.pages;
  },

  /**
   *  Render DOM into the renderFrame of the given pageRenderer
   *  @param {PageRenderer} pageRenderer - to supply page sizing and renderFrame
   *  @param {array} virtualBookPages - array of pages containing references to element
   */
  renderPage: function renderPage(pageRenderer, virtualBookPages) {
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
      pageDiv.setAttribute('class', CLASS_NAME_PREFIX);
      const refStyle = {
        // CSS to set up the page sizing
        width: pr.page.width,
        height: pr.page.height,
        paddingTop: pr.page.padding.top,
        paddingBottom: pr.page.padding.bottom,
        paddingLeft: pr.page.padding.left,
        paddingRight: pr.page.padding.right
      };
      helper.overwriteStyle(pageDiv.style, refStyle);

      pr.renderFrame.appendChild(pageDiv);

      // Put content into the page
      page.elements.forEach((node) => {
        pageDiv.appendChild(node.ele);
      });
    });
  },
};
