/*
** HTML XSS Filtering plugin by leizongmin
** https://github.com/leizongmin/js-xss
**
** Features:
** 1. Specifies HTML tags and their attributes allowed with whitelist
** 2. Handle any tags or attributes using custom function.
*/
const xssFilter = require('xss');

// get a copy of default whiteList
const whiteList = xssFilter.getDefaultWhiteList();

/*
** Custom whitelist (Adding to current whiteList to prevent filtering
** out some required HTML attributes for styling by plugins)
*/
whiteList.pre.push('class');
whiteList.code.push('class');
whiteList.span.push('class', 'aria-hidden', 'style', 'role');

// New tags not in whiteList that are required by plugins
whiteList.annotation = ['encoding'];
whiteList.math = [];
whiteList.semantics = [];
whiteList.mrow = [];
whiteList.msqrt = [];
whiteList.mn = [];
whiteList.mi = [];
whiteList.mo = [];
whiteList.msup = [];

// Custom safeAttrValue function for whiteList
function safeAttrValue(tag, name, value, cssFilter) {
  // only when the tag is 'span' and attribute is 'style'
  // then use your custom function
  if (tag === 'span' && name === 'style') {
    // only filter the value that start with 'javascript:'
    if (/^javascript:/ig.test(value)) {
      return '';
    }
    return value;
  } else {
    // use the default safeAttrValue function to process it
    return xssFilter.safeAttrValue(tag, name, value, cssFilter);
  }
}

// Setting xssFilter to use customised whiteList
const options = {
  whiteList,
  safeAttrValue
};

const documentFormatter = {
  format: function format(data) {
    // Filter out any possible XSS threat
    // console.log(whiteList);
    data = xssFilter(data, options);

    // Return data as it is for now.
    return data;
  }
};

module.exports = documentFormatter;
