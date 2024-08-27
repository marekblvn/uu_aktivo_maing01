import { Test, VisualComponent } from "uu5g05-test";
import ActivitySettingsView from "../../src/bricks/activity-settings-view.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ActivitySettingsView, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.ActivitySettingsView", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
