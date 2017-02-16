const wrapper = require('src/logic/wrapper');

describe('Wrapper', () => {
  it('should handle null data correctly', () => {
    const test1 = wrapper.render(null);

    expect(test1).to.equal('');
  });

  it('should handle empty data correctly', () => {
    const test2 = wrapper.render('');

    expect(test2).to.equal('');
  });

  it('should handle plaintext data correctly', () => {
    const test3 = wrapper.render('test');

    expect(test3).to.equal('<p>test</p>\n');
  });

  it('should handle markdown data correctly', () => {
    const test4 = wrapper.render('# Hello World!');

    expect(test4).to.equal('<h1>Hello World!</h1>\n');
  });
});
