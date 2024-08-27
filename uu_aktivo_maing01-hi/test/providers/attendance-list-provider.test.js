import { Test, VisualComponent } from "uu5g05-test";
import AttendanceListProvider from "../../src/providers/attendance-list-provider.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(AttendanceListProvider, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Providers.AttendanceListProvider", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
