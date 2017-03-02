import Vue from 'vue';
import Content from 'src/components/editor-viewer/Content';

const VIEWER_CONTAINER_ID = 'viewer-container';

describe('Content.vue', () => {
  // A mock viewer-container DOM is needed for this test.
  // It will be created before all the test are ran, and remove
  // when all the tests are finished.
  before(() => {
    const mockContainer = document.createElement('DIV');
    mockContainer.setAttribute('id', VIEWER_CONTAINER_ID);
    document.body.appendChild(mockContainer);
  });

  after(() => {
    const mockContainer = document.getElementById(VIEWER_CONTAINER_ID);
    if (mockContainer) { mockContainer.remove(); }
  });

  it('should render Editor component', () => {
    const Constructor = Vue.extend(Content);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.group .editor'))
      .to.not.equal(null);
  });
  it('should render Viewer component', () => {
    const Constructor = Vue.extend(Content);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.group .viewer'))
      .to.not.equal(null);
  });
});
