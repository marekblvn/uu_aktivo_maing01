import { Test, VisualComponent } from "uu5g05-test";
import ActivityPage from "../../src/routes/activity-page.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(ActivityPage, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Routes.ActivityPage", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
