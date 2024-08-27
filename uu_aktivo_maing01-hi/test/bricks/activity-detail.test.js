import { Test, VisualComponent } from "uu5g05-test";
import ActivityDetail from "../../src/bricks/activity-detail.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ActivityDetail, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.ActivityDetail", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
