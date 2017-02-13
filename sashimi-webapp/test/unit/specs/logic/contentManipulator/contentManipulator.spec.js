const cm = require('src/logic/contentManipulator/contentManipulator');

describe('ContentManipulator', () => {
  it('can set() and get()', () => {
    cm.set('test');
    expect(cm.get()).to.equal('test');
  });
});
