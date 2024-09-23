import { Test, VisualComponent } from "uu5g05-test";
import WelcomeContent from "../../src/bricks/welcome-content.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(WelcomeContent, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.WelcomeContent", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
