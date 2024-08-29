import { Test, VisualComponent } from "uu5g05-test";
import AttendanceManagement from "../../src/routes/attendance-management.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(AttendanceManagement, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Routes.AttendanceManagement", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
