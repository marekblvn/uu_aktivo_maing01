import { Test, VisualComponent } from "uu5g05-test";
import PostCard from "../../src/bricks/post-card.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(PostCard, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.PostCard", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
