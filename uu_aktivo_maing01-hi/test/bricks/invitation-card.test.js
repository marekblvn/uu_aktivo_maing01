import { Test, VisualComponent } from "uu5g05-test";
import InvitationCard from "../../src/bricks/invitation-card.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(InvitationCard, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.InvitationCard", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
