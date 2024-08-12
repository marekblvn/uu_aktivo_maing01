import { Test, VisualComponent } from "uu5g05-test";
import PostList from "../../src/bricks/post-list.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(PostList, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.PostList", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
