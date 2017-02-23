import wrapper from 'src/logic/documentPackager';

describe('Wrapper', () => {
  it('test1: handles empty data', () => {
    const test1 = wrapper.render('');

    expect(test1).to.equal('');
  });

  it('test2: handles plaintext data', () => {
    const test2 = wrapper.render('test');

    expect(test2).to.equal('<p>test</p>\n');
  });

  it('test3: handles markdowndata', () => {
    const test3 = wrapper.render('# Hello World!');

    expect(test3).to.equal('<h1 id="hello-world">Hello World!</h1>\n');
  });
});
