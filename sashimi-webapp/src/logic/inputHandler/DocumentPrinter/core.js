import documentPackager from 'src/logic/documentPackager';
import documentBuilder from 'src/helpers/documentBuilder';
import DiagramsRenderer from 'src/logic/renderer/diagrams';
import PageRenderer from 'src/logic/renderer';

const frame = {
  url: 'about:blank',
  target: '_blank',
  feature: 'location=yes,height=600,width=800,scrollbars=yes',
};

const pageSize = { // PAGE_A4
  width: '21.0cm',
  height: '29.7cm',
  padding: {
    top: '2.54cm',
    bottom: '2.54cm',
    right: '2.54cm',
    left: '2.54cm'
  }
};

export default {
  print(markdownData) {
    const printFrame = window.open(frame.url, frame.target, frame.feature);
    documentBuilder.rebuild(printFrame);
    documentBuilder.addStyles(printFrame, [
      '/styles/markdown-pages.css',
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
      const pr = new PageRenderer(renderTarget, pageSize, [
        new DiagramsRenderer()
      ]);
      return documentPackager.getHtmlData(markdownData)
      .then(htmlData => pr.write(htmlData));
    })
    .then(() => {
      printFrame.focus();
      printFrame.print();
    });
  }
};
