import unitConverter from 'src/helpers/unitConverter';

export default {
  overwriteStyle: function overwriteStyle(target, source) {
    Object.keys(source).forEach((styleKey) => {
      target[styleKey] = source[styleKey];
    });
  },

  computeRenderHeight: function computeRenderHeight(page) {
    return parseFloat(unitConverter.get(page.height, 'px'), 10) - (
           parseFloat(unitConverter.get(page.padding.top, 'px'), 10) +
           parseFloat(unitConverter.get(page.padding.bottom, 'px'), 10)
         );
  },
};
