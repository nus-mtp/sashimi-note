/*
** HTML XSS Filtering plugin by leizongmin
** https://github.com/leizongmin/js-xss
**
** Features:
** 1. Specifies HTML tags and their attributes allowed with whitelist
** 2. Handle any tags or attributes using custom function.
*/
import xssFilter from 'xss';

// some standard attributes that will be allowed
const allowedAttr = ['id', 'class', 'style'];

// get a copy of default whiteList
const whiteList = xssFilter.getDefaultWhiteList();

/*
** Custom whitelist (Adding to current whiteList to prevent filtering
** out some required HTML attributes for styling by plugins)
**
** Will require reviewing/reconstructing after proper integration as
** this is too "ugly"
*/
whiteList.span.push('aria-hidden', 'role');
whiteList.br.push('page');

// New tags not in whiteList that are required by KaTeX plugin
whiteList.annotation = ['encoding'];
whiteList.math = [];
whiteList.semantics = [];
whiteList.mrow = [];
whiteList.msqrt = [];
whiteList.mn = [];
whiteList.mi = [];
whiteList.mo = [];
whiteList.msup = [];
// allow ol specify start number
whiteList.ol = ['start'];
// allow li specify value number
whiteList.li = ['value'];
// allow style tag
whiteList.style = [];
// allow kbd tag
whiteList.kbd = [];
// allow ifram tag with some safe attributes
whiteList.iframe = ['allowfullscreen', 'name', 'referrerpolicy', 'sandbox', 'src', 'srcdoc', 'width', 'height'];
// allow summary tag
whiteList.summary = [];

// Custom safeAttrValue function for whiteList
function safeAttrValue(tag, name, value) {
  // any value that is 'javascript:'
  // it will be filtered to ''
  if (/^javascript:/ig.test(value)) {
    return '';
  } else {
    // use the default safeAttrValue function to process it
    return xssFilter.safeAttrValue(tag, name, value);
  }
}

function onIgnoreTagAttr(tag, name, value, isWhiteAttr) {
  // allow attr in the whiteListAttr
  if (allowedAttr.indexOf(name) !== -1) {
    // escape its value using custom safeAttrValue function
    return `${name}="${safeAttrValue(tag, name, value)}"`;
  } else {
    // for attributes that are not whitelisted
    // use default onIgnoreTagAttr function to process it
    return xssFilter.onIgnoreTagAttr(tag, name, value, isWhiteAttr);
  }
}

// Setting xssFilter to use customised whiteList
const options = {
  whiteList,
  safeAttrValue,
  onIgnoreTagAttr
};

export default {
  filter: function format(data) {
    // Filter out any possible XSS threat
    data = xssFilter(data, options);

    // Return data as it is for now.
    return data;
  }
};
