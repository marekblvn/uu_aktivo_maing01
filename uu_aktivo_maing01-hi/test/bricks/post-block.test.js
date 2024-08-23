import { Test, VisualComponent } from "uu5g05-test";
import PostBlock from "../../src/bricks/post-block.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(PostBlock, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.PostBlock", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
