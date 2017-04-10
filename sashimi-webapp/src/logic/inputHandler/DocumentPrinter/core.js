import documentPackager from 'src/logic/documentPackager';
import documentBuilder from 'src/helpers/documentBuilder';
import PageRenderer from 'src/logic/renderer';

const frame = {
  url: 'about:blank',
  target: '_blank',
  feature: 'location=yes,height=600,width=800,scrollbars=yes',
};

export default {
  print(markdownData) {
    const printFrame = window.open(frame.url, frame.target, frame.feature);
    documentBuilder.rebuild(printFrame);
    documentBuilder.addStyles(printFrame, [
      '/styles/markdown-html.css',
      '/styles/viewer-page.css',
      '/styles/markdown-imports.css'
    ])
    .then(() => {
      const iframeDoc = documentBuilder.getDocument(printFrame);
      iframeDoc.title = 'Sashimi Printed Document';

      const eleParent = iframeDoc.createElement('div');
      const eleContainer = iframeDoc.createElement('div');
      eleParent.appendChild(eleContainer);
      iframeDoc.body.appendChild(eleParent);
      return eleContainer;
    })
    .then((renderTarget) => {
      const pr = new PageRenderer(renderTarget);
      return documentPackager.getHtmlData(markdownData)
      .then(htmlData => pr.write(htmlData));
    })
    .then(() => {
      printFrame.focus();
      printFrame.print();
    });
  }
};
