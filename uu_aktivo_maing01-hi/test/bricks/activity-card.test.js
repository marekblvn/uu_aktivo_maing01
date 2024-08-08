import { Test, VisualComponent } from "uu5g05-test";
import ActivityCard from "../../src/bricks/activity-card.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ActivityCard, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.ActivityCard", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
