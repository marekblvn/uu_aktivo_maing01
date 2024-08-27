import { Test, VisualComponent } from "uu5g05-test";
import AttendanceItem from "../../src/bricks/attendance-item.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(AttendanceItem, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.AttendanceItem", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
