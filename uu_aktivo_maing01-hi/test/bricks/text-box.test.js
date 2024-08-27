import { Test, VisualComponent } from "uu5g05-test";
import TextBox from "../../src/bricks/text-box.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(TextBox, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.TextBox", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
