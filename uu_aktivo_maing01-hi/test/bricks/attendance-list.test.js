import { Test, VisualComponent } from "uu5g05-test";
import AttendanceList from "../../src/bricks/attendance-list.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(AttendanceList, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.AttendanceList", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
