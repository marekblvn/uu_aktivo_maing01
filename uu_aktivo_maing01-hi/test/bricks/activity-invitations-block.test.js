import { Test, VisualComponent } from "uu5g05-test";
import ActivityInvitationsBlock from "../../src/bricks/activity-invitations-block.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ActivityInvitationsBlock, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.ActivityInvitationsBlock", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
