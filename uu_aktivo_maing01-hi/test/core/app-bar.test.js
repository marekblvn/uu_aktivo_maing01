import { Test, VisualComponent } from "uu5g05-test";
import AppBar from "../../src/core/app-bar.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(AppBar, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Core.AppBar", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
