import { Test, VisualComponent } from "uu5g05-test";
import InvitationTable from "../../src/bricks/invitation-table.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(InvitationTable, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.InvitationTable", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
