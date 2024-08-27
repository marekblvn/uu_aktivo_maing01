import { Test, VisualComponent } from "uu5g05-test";
import TransferOwnershipModal from "../../src/bricks/transfer-ownership-modal.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(TransferOwnershipModal, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.TransferOwnershipModal", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
