/*
** HTML XSS Filtering plugin by leizongmin
** https://github.com/leizongmin/js-xss
**
** Features:
** 1. Specifies HTML tags and their attributes allowed with whitelist
** 2. Handle any tags or attributes using custom function.
*/
import xssFilter from 'xss';

// get a copy of default whiteList
const whiteList = xssFilter.getDefaultWhiteList();

/*
** Custom whitelist (Adding to current whiteList to prevent filtering
** out some required HTML attributes for styling by plugins)
**
** Will require reviewing/reconstructing after proper integration as
** this is too "ugly"
*/
whiteList.pre.push('class');
whiteList.code.push('class');
whiteList.span.push('class', 'aria-hidden', 'style', 'role');
whiteList.h1.push('id');
whiteList.h2.push('id');
whiteList.h3.push('id');
whiteList.h4.push('id');
whiteList.h5.push('id');
whiteList.h6.push('id');
whiteList.div.push('class');

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
whiteList.pagebreak = [];

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
  } else if (tag === 'div' && name === 'class') {
    if (/^javascript:/ig.test(value)) {
      return '';
    }
    return value;
  } else if (tag === 'h1' && name === 'id') {
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

export default {
  filter: function format(data) {
    // Filter out any possible XSS threat
    // console.log(whiteList);
    data = xssFilter(data, options);

    // Return data as it is for now.
    return data;
  }
};
