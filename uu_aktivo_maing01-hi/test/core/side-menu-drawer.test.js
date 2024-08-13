import { Test, VisualComponent } from "uu5g05-test";
import SideMenuDrawer from "../../src/core/side-menu-drawer.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(SideMenuDrawer, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Core.SideMenuDrawer", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
