import { Test, VisualComponent } from "uu5g05-test";
import FormModal from "../../src/bricks/form-modal.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(FormModal, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.FormModal", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
