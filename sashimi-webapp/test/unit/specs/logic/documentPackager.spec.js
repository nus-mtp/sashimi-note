import documentPackager from 'src/logic/documentPackager';

describe('Document Packager', () => {
  describe('getHtmlData', () => {
    it('should handles empty data', (done) => {
      documentPackager.getHtmlData('')
      .then((output) => {
        expect(output).to.equal('');
        done();
      })
      .catch((error) => {
        done(error);
      });
    });

    it('should handles plaintext data', (done) => {
      documentPackager.getHtmlData('test')
      .then((output) => {
        expect(output).to.equal('<p>test</p>\n');
        done();
      })
      .catch((error) => {
        done(error);
      });
    });

    it('should handles markdown data', (done) => {
      documentPackager.getHtmlData('# Hello World!')
      .then((output) => {
        expect(output).to.equal('<h1 id="hello-world">Hello World!</h1>\n');
        done();
      })
      .catch((error) => {
        done(error);
      });
    });
  });
});
