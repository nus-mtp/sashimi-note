const myMod = require("src/logic/processor/MarkdownProcessor");

describe('Test for MarkdownProcessor', () => {
  it("is now running...", () => {
    const test = myMod.process("# Hello");
    expect(test).to.equal("<h1>Hello</h1>\n");
  });
});
