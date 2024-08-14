import { Test, VisualComponent } from "uu5g05-test";
import UpdateFrequencyModal from "../../src/bricks/update-frequency-modal.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(UpdateFrequencyModal, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.UpdateFrequencyModal", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
