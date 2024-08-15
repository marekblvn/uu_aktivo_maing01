import { Test, VisualComponent } from "uu5g05-test";
import DatetimeSettingsBlock from "../../src/bricks/datetime-settings-block.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(DatetimeSettingsBlock, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.DatetimeSettingsBlock", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
