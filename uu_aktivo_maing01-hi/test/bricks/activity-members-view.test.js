import { Test, VisualComponent } from "uu5g05-test";
import ActivityMembersView from "../../src/bricks/activity-members-view.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ActivityMembersView, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.ActivityMembersView", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
