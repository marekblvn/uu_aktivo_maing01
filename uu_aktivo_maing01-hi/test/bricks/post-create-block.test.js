import { Test, VisualComponent } from "uu5g05-test";
import PostCreateBlock from "../../src/bricks/post-create-block.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(PostCreateBlock, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.PostCreateBlock", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
