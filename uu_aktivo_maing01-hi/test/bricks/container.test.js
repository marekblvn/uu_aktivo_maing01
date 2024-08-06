import { Test, VisualComponent } from "uu5g05-test";
import Container from "../../src/bricks/container.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(Container, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.Container", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
