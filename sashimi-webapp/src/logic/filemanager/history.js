const previousHistory = [];
let nextHistory = [];
let currItem = null;

const history = {

  /**
   * Update the current item
   *
   * @param {Object} item
   * @return {Object}
   */
  update: function update(item) {
    if (currItem) {
      previousHistory.push(currItem);
      nextHistory = [];
    }
    currItem = item;
    return currItem;
  },

  /**
   * Return the most recently updated item
   *
   * @return {Object}
   */
  previous: function previous() {
    if (previousHistory.length > 0) {
      nextHistory.push(currItem);
      currItem = previousHistory.pop();
    }

    return currItem;
  },

  /**
   * Return the item before previous was called
   *
   * @return {Object}
   */
  next: function next() {
    if (nextHistory.length > 0) {
      previousHistory.push(currItem);
      currItem = nextHistory.pop();
    }

    return currItem;
  }

};

export default history;
