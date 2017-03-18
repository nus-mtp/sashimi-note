import Vue from 'vue';
import Content from 'src/components/editor-viewer/Content';

const VIEWER_CONTAINER_ID = 'viewer-container';

const mockContainer = document.createElement('DIV');
mockContainer.setAttribute('id', VIEWER_CONTAINER_ID);
document.body.appendChild(mockContainer);

describe('Content.vue', () => {
  // A mock viewer-container DOM is needed for this test.
  // It will be created before all the test are ran, and remove
  // when all the tests are finished.
  it('should render Navbar component', () => {
    const Constructor = Vue.extend(Content);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.navbar'))
      .to.not.equal(null);
  });
  it('should render toggle edit button', () => {
    const Constructor = Vue.extend(Content);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.navbar #button-editor'))
      .to.not.equal(null);
  });
  it('should render toggle edit button', () => {
    const Constructor = Vue.extend(Content);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.navbar #button-viewer'))
      .to.not.equal(null);
  });
  it('should render toggle edit button', () => {
    const Constructor = Vue.extend(Content);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.navbar #button-split-screen'))
      .to.not.equal(null);
  });
  it('should render Editor wrapper', () => {
    const Constructor = Vue.extend(Content);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.editor-wrapper'))
      .to.not.equal(null);
  });
  it('should render Viewer wrapper', () => {
    const Constructor = Vue.extend(Content);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.viewer-wrapper'))
      .to.not.equal(null);
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
