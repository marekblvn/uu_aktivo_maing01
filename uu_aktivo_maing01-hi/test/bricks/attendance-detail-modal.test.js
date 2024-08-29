import { Test, VisualComponent } from "uu5g05-test";
import AttendanceDetailModal from "../../src/bricks/attendance-detail-modal.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(AttendanceDetailModal, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.AttendanceDetailModal", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
