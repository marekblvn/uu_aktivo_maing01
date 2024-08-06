import { Test, VisualComponent } from "uu5g05-test";
import PageHeader from "../../src/bricks/page-header.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(PageHeader, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.PageHeader", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
