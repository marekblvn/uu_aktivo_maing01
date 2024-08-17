import { Test, VisualComponent } from "uu5g05-test";
import CreateDatetimeModal from "../../src/bricks/create-datetime-modal.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(CreateDatetimeModal, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.CreateDatetimeModal", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
