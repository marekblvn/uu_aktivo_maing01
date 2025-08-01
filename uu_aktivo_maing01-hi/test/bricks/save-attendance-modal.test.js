import { Test, VisualComponent } from "uu5g05-test";
import SaveAttendanceModal from "../../src/bricks/save-attendance-modal.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(SaveAttendanceModal, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.SaveAttendanceModal", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
