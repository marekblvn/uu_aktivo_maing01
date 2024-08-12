import { Test, VisualComponent } from "uu5g05-test";
import PostListProvider from "../../src/providers/post-list-provider.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(PostListProvider, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Providers.PostListProvider", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
