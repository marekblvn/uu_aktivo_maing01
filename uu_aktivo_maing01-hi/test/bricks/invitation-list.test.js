import { Test, VisualComponent } from "uu5g05-test";
import InvitationList from "../../src/bricks/invitation-list.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(InvitationList, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.InvitationList", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
