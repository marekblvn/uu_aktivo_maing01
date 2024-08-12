import { Test, VisualComponent } from "uu5g05-test";
import ParticipationInfoText from "../../src/bricks/participation-info-text.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ParticipationInfoText, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.ParticipationInfoText", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
