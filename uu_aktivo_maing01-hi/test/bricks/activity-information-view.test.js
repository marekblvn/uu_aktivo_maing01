import { Test, VisualComponent } from "uu5g05-test";
import ActivityInformationView from "../../src/bricks/activity-information-view.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ActivityInformationView, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.ActivityInformationView", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
