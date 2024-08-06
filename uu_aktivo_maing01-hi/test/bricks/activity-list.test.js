import { Test, VisualComponent } from "uu5g05-test";
import ActivityList from "../../src/bricks/activity-list.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ActivityList, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.ActivityList", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
