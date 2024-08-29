import { Test, VisualComponent } from "uu5g05-test";
import AttendanceTable from "../../src/bricks/attendance-table.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(AttendanceTable, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.AttendanceTable", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
