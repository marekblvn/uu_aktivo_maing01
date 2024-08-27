import { Test, VisualComponent } from "uu5g05-test";
import ParticipationItem from "../../src/bricks/participation-item.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ParticipationItem, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.ParticipationItem", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
