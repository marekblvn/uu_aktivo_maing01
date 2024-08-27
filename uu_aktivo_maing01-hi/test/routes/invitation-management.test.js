import { Test, VisualComponent } from "uu5g05-test";
import InvitationManagement from "../../src/routes/invitation-management.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(InvitationManagement, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Routes.InvitationManagement", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
