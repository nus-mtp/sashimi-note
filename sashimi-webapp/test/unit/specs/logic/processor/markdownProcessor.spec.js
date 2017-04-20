import myMod from 'src/logic/documentPackager/markdownProcessor';

/* eslint max-len: 0 */
// Remove all warning about max-len in this test file

describe('Test for MarkdownProcessor', () => {
  it('should produce correct HTML format for Headers', () => {
    const testH1 = myMod.process('# Hello World!');
    const testH2 = myMod.process('## H2!');
    const testH3 = myMod.process('### H3!');
    const testH4 = myMod.process('#### H4!');
    const testH5 = myMod.process('##### H5!');
    const testH6 = myMod.process('###### H6!');
    const testAltH1 = myMod.process('Alt-H1!\n======');
    const testAltH2 = myMod.process('Alt-H2!\n------');

    expect(testH1).to.equal('<h1 id="hello-world" class="code-line" data-line-start="1" data-line-end="1">Hello World!</h1>\n');
    expect(testH2).to.equal('<h2 id="h2" class="code-line" data-line-start="1" data-line-end="1">H2!</h2>\n');
    expect(testH3).to.equal('<h3 id="h3" class="code-line" data-line-start="1" data-line-end="1">H3!</h3>\n');
    expect(testH4).to.equal('<h4 id="h4" class="code-line" data-line-start="1" data-line-end="1">H4!</h4>\n');
    expect(testH5).to.equal('<h5 id="h5" class="code-line" data-line-start="1" data-line-end="1">H5!</h5>\n');
    expect(testH6).to.equal('<h6 id="h6" class="code-line" data-line-start="1" data-line-end="1">H6!</h6>\n');
    expect(testAltH1).to.equal('<h1 id="alt-h1" class="code-line" data-line-start="1" data-line-end="2">Alt-H1!</h1>\n');
    expect(testAltH2).to.equal('<h2 id="alt-h2" class="code-line" data-line-start="1" data-line-end="2">Alt-H2!</h2>\n');
  });
  it('should render correct typhographical Emphasis', () => {
    const testEm1 = myMod.process('Emphasis, aka italics, with *asterisks*'
                                  + ' or _underscores_.');
    const testEm2 = myMod.process('Strong emphasis, aka bold, with'
                                  + ' **asterisks** or __underscores__.');
    const testEm3 = myMod.process('Combined emphasis with **asterisks and'
                                  + ' _underscores_**.');
    const testEm4 = myMod.process('Strikethrough uses two tildes.'
                                  + ' ~~Scratch this.~~');

    expect(testEm1).to.equal('<p class="code-line" data-line-start="1" data-line-end="1">'
                            + 'Emphasis, aka italics, with '
                            + '<em>asterisks</em> or <em>underscores</em>'
                            + '.</p>\n');
    expect(testEm2).to.equal('<p class="code-line" data-line-start="1" data-line-end="1">'
                            + 'Strong emphasis, aka bold, with '
                            + '<strong>asterisks</strong> or '
                            + '<strong>underscores</strong>.</p>\n');
    expect(testEm3).to.equal('<p class="code-line" data-line-start="1" data-line-end="1">'
                            + 'Combined emphasis with <strong>asterisks'
                            + ' and <em>underscores</em></strong>.</p>\n');
    expect(testEm4).to.equal('<p class="code-line" data-line-start="1" data-line-end="1">'
                            + 'Strikethrough uses two tildes.'
                            + ' <s>Scratch this.</s></p>\n');
  });
  it('should render correct HTML format for Lists', () => {
    const testOList = myMod.process('1. First ordered list item\n2. Another ' +
    'item\n   * Sub-list of ordered lists. Just indent by 3 spaces (or tab) ' +
    'to make a sub-list\n1. Actual numbers do not matter, just that it is a ' +
    'number\n   1. Ordered sub-list\n4. And another item.\n\n   You can have ' +
    'properly indented paragraphs within list items. Notice the blank line ' +
    'above, and the leading spaces (indent 3 spaces).\n');
    const testUList = myMod.process('* Unordered list can use asterisks\n- ' +
    'Or minuses\n+ Or pluses\n* Sub-lists of unordered lists are made by ' +
    'indenting 2 spaces\n  * Hi');

    // In the future, we should only compare tag and its content;
    // Instead of comparing character by character.
    const expectedOrderedList = `<ol class="code-line" data-line-start="1" data-line-end="8">
<li class="code-line" data-line-start="1" data-line-end="1">
<p class="code-line" data-line-start="1" data-line-end="1">First ordered list item</p>
</li>
<li class="code-line" data-line-start="2" data-line-end="3">
<p class="code-line" data-line-start="2" data-line-end="2">Another item</p>
<ul class="code-line" data-line-start="3" data-line-end="3">
<li>Sub-list of ordered lists. Just indent by 3 spaces (or tab) to make a sub-list</li>
</ul>
</li>
<li class="code-line" data-line-start="4" data-line-end="5">
<p class="code-line" data-line-start="4" data-line-end="4">Actual numbers do not matter, just that it is a number</p>
<ol class="code-line" data-line-start="5" data-line-end="5">
<li>Ordered sub-list</li>
</ol>
</li>
<li class="code-line" data-line-start="6" data-line-end="8">
<p class="code-line" data-line-start="6" data-line-end="6">And another item.</p>
<p class="code-line" data-line-start="8" data-line-end="8">You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (indent 3 spaces).</p>
</li>
</ol>
`;
    const expectedUnorderedList = `<ul class="code-line" data-line-start="1" data-line-end="1">
<li class="code-line" data-line-start="1" data-line-end="1">Unordered list can use asterisks</li>
</ul>
<ul class="code-line" data-line-start="2" data-line-end="2">
<li class="code-line" data-line-start="2" data-line-end="2">Or minuses</li>
</ul>
<ul class="code-line" data-line-start="3" data-line-end="3">
<li class="code-line" data-line-start="3" data-line-end="3">Or pluses</li>
</ul>
<ul class="code-line" data-line-start="4" data-line-end="5">
<li class="code-line" data-line-start="4" data-line-end="5">Sub-lists of unordered lists are made by indenting 2 spaces
<ul class="code-line" data-line-start="5" data-line-end="5">
<li>Hi</li>
</ul>
</li>
</ul>
`;
    expect(testOList).to.equal(expectedOrderedList);
    expect(testUList).to.equal(expectedUnorderedList);
  });
});
