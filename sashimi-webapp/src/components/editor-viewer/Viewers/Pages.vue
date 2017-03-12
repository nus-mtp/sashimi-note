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
        console.log(childWidth, parentWidth);

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

        // attach event listener
        parentEle.parentNode.addEventListener('mousewheel', (event) => {
          event.preventDefault();
          if (event.ctrlKey) {
            let nowScale = parseFloat(parentEle.style.transform.substring(6));
            let toScale = nowScale * (1 - (event.deltaY / 1000));
            parentEle.style.transform = setTransform({ scale: toScale });
          } else {
            parentEle.style.transform = setTransform({ y: (translateY - (event.deltaY/4)) });
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
            parentEle.style.transform = setTransform({
              y: (translateY + event.movementY),
              x: (translateX + event.movementX)
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
