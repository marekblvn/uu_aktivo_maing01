import { Test, VisualComponent } from "uu5g05-test";
import ActivityNavigationBar from "../../src/bricks/activity-navigation-bar.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ActivityNavigationBar, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.ActivityNavigationBar", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
