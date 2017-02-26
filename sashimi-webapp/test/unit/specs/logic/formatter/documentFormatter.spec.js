const documentFormatter = require('src/logic/wrapper/documentFormatter');

describe('DocumentFormatter', () => {
  it('returns the same data', () => {
    const test1 = documentFormatter.format('test');
    expect(test1).to.equal('test');
  });
});
