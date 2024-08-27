import { Test, VisualComponent } from "uu5g05-test";
import CreateActivityModal from "../../src/bricks/create-activity-modal.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(CreateActivityModal, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.CreateActivityModal", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
