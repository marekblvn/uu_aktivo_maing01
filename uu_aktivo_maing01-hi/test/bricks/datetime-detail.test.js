import { Test, VisualComponent } from "uu5g05-test";
import DatetimeDetail from "../../src/bricks/datetime-detail.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(DatetimeDetail, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.DatetimeDetail", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
