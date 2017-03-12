<template>
  <div id='viewer-container'>
    <div class="page-view"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import _ from 'lodash';
  import PageRenderer from 'src/logic/renderer';
  import unitConverter from 'src/helpers/unitConverter';
  
  function translateYGuard(translateY, parentEle) {
    const bottomLimit = (() => {
      const numberOfElement = parentEle.childNodes.length;
      const pageHeight = unitConverter.get(parentEle.childNodes[0].style.height, 'px', false);
      const pageMargin = unitConverter.get(getComputedStyle(parentEle.childNodes[0]).marginTop, 'px', false);
      return -(numberOfElement - 0.75) * (pageHeight + pageMargin);
    })();
    if (translateY < bottomLimit) translateY = bottomLimit;
    if (translateY > 0) translateY = 0;
    return translateY;
  }

  function translateXGuard(translateX, parentEle) {
    const sideLimit = (() => {
      const pageWidth = unitConverter.get(parentEle.childNodes[0].style.width, 'px', false);
      return pageWidth/2;
    })();
    if (translateX < -sideLimit) translateX = -sideLimit;
    if (translateX > sideLimit) translateX = sideLimit;
    return translateX;
  }
  
  // Throttle function used to limit the rate which
  // the render function is called
  const throttleTime = 600;
  const renderThrottleFn = _.throttle((htmlData, pr) => pr.write(htmlData), throttleTime);

  export default {
    props: ['htmlData'],
    data() {
      return {
        pageRenderer: null
      };
    },
    watch: {
      htmlData() {
        renderThrottleFn(this.htmlData, this.pageRenderer);
      }
    },
    mounted() {
      // Mount does not gurrantee DOM to be ready, thus nextTick is used
      Vue.nextTick(() => {
        this.pageRenderer = new PageRenderer('viewer-container');
        renderThrottleFn(this.htmlData, this.pageRenderer);
        const page = this.pageRenderer.page;
        const parentEle = document.getElementById('viewer-container');

        const childWidth = unitConverter.get(page.width, 'px', false);
        const parentWidth = parentEle.parentNode.clientWidth;

        const ratio = (parentWidth - 80)/childWidth;

        let currentScale = ratio;
        let translateX = 0;
        let translateY = 0;

        function setTransform(stuff) {
          currentScale = stuff.scale || currentScale;
          translateX = (stuff.x != null) ? stuff.x : translateX;
          translateY = (stuff.y != null) ? stuff.y : translateY;
          console.log(`scale(${currentScale}) translate(${translateX}, ${translateY})`);
          return `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
        }

        parentEle.style.transform = setTransform({ scale: currentScale, x: translateX, y: translateY });

        // Attach event listener
        window.addEventListener('resize', (event) => {
          const childSubWidth = unitConverter.get(page.width, 'px', false);
          const parentSubWidth = parentEle.parentNode.clientWidth;

          const subRatio = (parentSubWidth - 80)/childSubWidth;
          parentEle.style.transform = setTransform({ scale: subRatio });
        });

        parentEle.parentNode.addEventListener('mousewheel', (event) => {
          event.preventDefault();
          if (event.ctrlKey) {
            const nowScale = parseFloat(parentEle.style.transform.substring(6));
            const toScale = nowScale * (1 - (event.deltaY / 1000));
            parentEle.style.transform = setTransform({ scale: toScale });
          } else {
            let toTranslate = translateY - (event.deltaY/4);
            toTranslate = translateYGuard(toTranslate, parentEle);
            parentEle.style.transform = setTransform({ y: toTranslate });
          }
        }, false);

        let isMouseDown = false;

        parentEle.parentNode.addEventListener('mousedown', (event) => {
          event.preventDefault();
          isMouseDown = true;
        });

        parentEle.parentNode.addEventListener('mousemove', (event) => {
          event.preventDefault();
          if (isMouseDown) {
            let toTranslateY = translateY + event.movementY;
            let toTranslateX = translateX + event.movementX;
            toTranslateY = translateYGuard(toTranslateY, parentEle);
            toTranslateX = translateXGuard(toTranslateX, parentEle);

            parentEle.style.transform = setTransform({
              y: toTranslateY,
              x: toTranslateX
            });
          }
        });

        parentEle.parentNode.addEventListener('mouseup', (event) => {
          isMouseDown = false;
        });
      });
    }
  };

</script>
