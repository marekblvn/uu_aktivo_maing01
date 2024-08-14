import { Test, VisualComponent } from "uu5g05-test";
import UpdateActivityModal from "../../src/bricks/update-activity-modal.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(UpdateActivityModal, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.UpdateActivityModal", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
