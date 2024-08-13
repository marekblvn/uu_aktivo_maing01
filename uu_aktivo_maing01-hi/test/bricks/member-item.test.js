import { Test, VisualComponent } from "uu5g05-test";
import MemberItem from "../../src/bricks/member-item.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(MemberItem, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.MemberItem", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
