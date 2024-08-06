import { Test, VisualComponent } from "uu5g05-test";
import WelcomeHeader from "../../src/bricks/welcome-header.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(WelcomeHeader, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.WelcomeHeader", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
