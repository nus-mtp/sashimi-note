const myMod = require("../../../app/logic/processor/markdownProcessor");

describe('Test for MarkdownProcessor', function() {
  it("is now running...", function() {
    const test = myMod.process("# Hello");
    expect(test).toBe("<h1 class=\"part\" data-startline=\"1\" data-endline=\"1\" id=\"hello\"><a class=\"anchor hidden-xs\" href=\"#hello\" title=\"hello\" smoothhashscroll=\"\"><span class=\"octicon octicon-link\"></span></a>Hello:</h1>");
  });
});
