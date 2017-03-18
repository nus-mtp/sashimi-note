import unitConverter from 'src/helpers/unitConverter';

const guard = {
  translateY(translateY, parentEle) {
    const bottomLimit = (() => {
      const numberOfElement = parentEle.childNodes.length;
      const pageHeight = unitConverter.get(parentEle.childNodes[0].style.height, 'px', false);
      const pageMargin = unitConverter.get(getComputedStyle(parentEle.childNodes[0]).marginTop, 'px', false);
      return -(numberOfElement) * (pageHeight + pageMargin);
    })();
    if (translateY < bottomLimit) translateY = bottomLimit;
    if (translateY > 0) translateY = 0;
    return translateY;
  },
  translateX(translateX, parentEle) {
    const sideLimit = (() => {
      const pageWidth = unitConverter.get(parentEle.childNodes[0].style.width, 'px', false);
      return (pageWidth / 2);
    })();
    if (translateX < -sideLimit) translateX = -sideLimit;
    if (translateX > sideLimit) translateX = sideLimit;
    return translateX;
  },
  scale(scale) {
    if (scale < 0.05) scale = 0.05;
    if (scale > 15) scale = 15;
    return scale;
  }
};

export default {
  updateWindowSize(event) {
    // Retrieve the resized width
    const marginWidth = 60;
    // Resize the element's transformer
    this.transform.set({ scale: (this.width.parent - marginWidth) / this.width.element });
  },

  pointermove(event) {
    const moveSpeed = (1/this.transform.scale);
    const translateY = guard.translateY(this.transform.translateY + (event.dy * moveSpeed), this.el.container);
    let translateX = 0;
    if ((this.width.parent) < this.width.element * this.transform.scale) {
      translateX = guard.translateX(this.transform.translateX + (event.dx * moveSpeed), this.el.container);
    }

    // translate the element
    this.transform.set({ translateX, translateY });
  },

  interactZoom(event) {
    if (!event.ds) event.ds = (-event.deltaY / 1000);
    let scale = this.transform.scale * (1 + event.ds);
    scale = guard.scale(scale);
    this.transform.set({ scale });
  },

  mousewheel(event) {
    event.preventDefault();
    if (event.ctrlKey) {
      this.interactZoom.call(this, event);
    } else {
      let translateY = this.transform.translateY - ((event.deltaY/4) * (1 / this.transform.scale));
      translateY = guard.translateY(translateY, this.el.container);
      this.transform.set({ translateY });
    }
  }
};