import { Test, VisualComponent } from "uu5g05-test";
import ActivityProvider from "../../src/providers/activity-provider.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ActivityProvider, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Providers.ActivityProvider", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
