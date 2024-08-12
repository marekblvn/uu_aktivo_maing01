import { Test, VisualComponent } from "uu5g05-test";
import DatetimeBlock from "../../src/bricks/datetime-block.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(DatetimeBlock, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.DatetimeBlock", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
