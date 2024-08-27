import { Test, VisualComponent } from "uu5g05-test";
import CreateInvitationModal from "../../src/bricks/create-invitation-modal.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(CreateInvitationModal, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.CreateInvitationModal", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
