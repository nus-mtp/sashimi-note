import Vue from 'vue';
import Content from 'src/components/editor-viewer/Content';

describe('Content.vue', () => {
  it('should render CodeMirror DOM', () => {
    const Constructor = Vue.extend(Content);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.group .CodeMirror'))
      .to.not.equal(null);
  });
  it('should render Viewer component', () => {
    const Constructor = Vue.extend(Content);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.group .viewer'))
      .to.not.equal(null);
  });
});
