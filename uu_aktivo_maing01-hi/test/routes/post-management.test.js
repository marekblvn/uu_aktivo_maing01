import { Test, VisualComponent } from "uu5g05-test";
import PostManagement from "../../src/routes/post-management.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(PostManagement, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Routes.PostManagement", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
