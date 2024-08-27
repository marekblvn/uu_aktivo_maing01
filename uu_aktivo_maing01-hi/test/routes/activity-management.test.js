import { Test, VisualComponent } from "uu5g05-test";
import ActivityManagement from "../../src/routes/activity-management.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ActivityManagement, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Routes.ActivityManagement", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
