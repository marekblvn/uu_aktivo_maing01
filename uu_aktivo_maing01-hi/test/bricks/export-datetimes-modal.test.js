import { Test, VisualComponent } from "uu5g05-test";
import ExportDatetimesModal from "../../src/bricks/export-datetimes-modal.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ExportDatetimesModal, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.ExportDatetimesModal", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
