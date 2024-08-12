import { Test, VisualComponent } from "uu5g05-test";
import ActivityAuthorizationContext from "../../src/contexts/activity-authorization-context.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ActivityAuthorizationContext, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Contexts.ActivityAuthorizationContext", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
