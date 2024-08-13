import { Test, VisualComponent } from "uu5g05-test";
import MemberList from "../../src/bricks/member-list.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(MemberList, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.MemberList", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
