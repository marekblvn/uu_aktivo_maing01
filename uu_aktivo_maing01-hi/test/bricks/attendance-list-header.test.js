import { Test, VisualComponent } from "uu5g05-test";
import AttendanceListHeader from "../../src/bricks/attendance-list-header.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(AttendanceListHeader, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.AttendanceListHeader", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
