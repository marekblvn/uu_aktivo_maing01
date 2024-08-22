import { Test, VisualComponent } from "uu5g05-test";
import DatetimeManagementModal from "../../src/bricks/datetime-management-modal.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(DatetimeManagementModal, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.DatetimeManagementModal", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
