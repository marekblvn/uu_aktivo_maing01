import { Test, VisualComponent } from "uu5g05-test";
import Invitations from "../../src/routes/invitations.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(Invitations, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Routes.Invitations", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
