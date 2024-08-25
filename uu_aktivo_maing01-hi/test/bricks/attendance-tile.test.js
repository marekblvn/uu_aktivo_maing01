import { Test, VisualComponent } from "uu5g05-test";
import AttendanceTile from "../../src/bricks/attendance-tile.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(AttendanceTile, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.AttendanceTile", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
