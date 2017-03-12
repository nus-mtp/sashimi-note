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
      });

      setTimeout(() => {
        const page = this.pageRenderer.page;
        const parentEle = document.getElementById('viewer-container');

        const childWidth = unitConverter.get(page.width, 'px', false);
        const parentWidth = parentEle.parentNode.clientWidth;
        console.log(childWidth, parentWidth);

        const ratio = (parentWidth - 80)/childWidth;

        let currentScale = ratio;
        parentEle.style.transform = `scale(${currentScale})`;

        // attach event listener
        parentEle.parentNode.addEventListener('mousewheel', (event) => {
          event.preventDefault();
          if (event.ctrlKey) {
            let nowScale = parseFloat(parentEle.style.transform.substring(6));
            let toScale = nowScale * (1 - (event.deltaY / 1000));
            parentEle.style.transform = `scale(${toScale})`;
          } else {
            parentEle.style.top = (parseFloat((parentEle.style.top || 0)) + (-event.deltaY / 2)) + 'px';
          }
        }, false);

        let isMouseDown = false;
        let initialX = -1;
        let initialY = -1;

        parentEle.parentNode.addEventListener('mousedown', (event) => {
          console.log(event.offsetX, parentEle.parentNode.clientLeft, event.offsetY, parentEle.parentNode.clientTop);
          // console.log(parentEle.offsetLeft, parentEle.offsetTop);
          isMouseDown = true;

          if (initialX < 0) initialX = event.offsetX;
          if (initialY < 0) initialY = event.offsetY;
        });

        parentEle.parentNode.addEventListener('mousemove', (event) => {
          event.preventDefault();
          if (isMouseDown) {
            /* eslint prefer-template: 0 */
            parentEle.style.left = (parseFloat((parentEle.style.left || 0)) + event.movementX) + 'px';
            parentEle.style.top = (parseFloat((parentEle.style.top || 0)) + event.movementY) + 'px';

            console.log(parentEle.style.top);
            console.log(event.movementX, event.movementY);
          }
        });

        parentEle.parentNode.addEventListener('mouseup', (event) => {
          isMouseDown = false;
        });
      }, 300);
    }
  };

</script>
