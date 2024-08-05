import { Test, VisualComponent } from "uu5g05-test";
import Logo from "../../src/core/logo.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(Logo, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Core.Logo", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
