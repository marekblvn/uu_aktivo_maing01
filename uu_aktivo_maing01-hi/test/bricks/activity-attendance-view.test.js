import { Test, VisualComponent } from "uu5g05-test";
import ActivityAttendanceView from "../../src/bricks/activity-attendance-view.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ActivityAttendanceView, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.ActivityAttendanceView", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
