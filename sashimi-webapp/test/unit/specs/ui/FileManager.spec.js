import Vue from 'vue';
import FileManager from 'src/components/file-manager/FileManager';

describe('FileManager.vue', () => {
  const Constructor = Vue.extend(FileManager);
  const vm = new Constructor().$mount();

  it('should render userInputs navbar component', () => {
    expect(vm.$el.querySelector('.navbar'))
      .to.not.equal(null);
  });
  it('should render userInputs userActions component', () => {
    expect(vm.$el.querySelector('.userActions'))
      .to.not.equal(null);
  });
  it('should render create folder button', () => {
    expect(vm.$el.querySelector('.userActions #button-create-folder'))
      .to.not.equal(null);
  });
  it('should render download button', () => {
    expect(vm.$el.querySelector('.userActions #button-file-download'))
      .to.not.equal(null);
  });
  it('should render delete button', () => {
    expect(vm.$el.querySelector('.userActions #button-delete'))
      .to.not.equal(null);
  });
  it('should render icon view button', () => {
    expect(vm.$el.querySelector('#button-icon-view'))
      .to.not.equal(null);
  });
  it('should render list view button', () => {
    expect(vm.$el.querySelector('#button-list-view'))
      .to.not.equal(null);
  });
  it('should render Documents component', () => {
    expect(vm.$el.querySelector('.documents'))
      .to.not.equal(null);
  });
});
