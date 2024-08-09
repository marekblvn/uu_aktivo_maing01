import { Test, VisualComponent } from "uu5g05-test";
import InvitationListProvider from "../../src/providers/invitation-list-provider.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(InvitationListProvider, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Providers.InvitationListProvider", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
