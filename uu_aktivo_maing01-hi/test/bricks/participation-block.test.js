import { Test, VisualComponent } from "uu5g05-test";
import ParticipationBlock from "../../src/bricks/participation-block.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ParticipationBlock, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.ParticipationBlock", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
