import { Test, VisualComponent } from "uu5g05-test";
import UpdateNotificationOffsetModal from "../../src/bricks/update-notification-offset-modal.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(UpdateNotificationOffsetModal, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.UpdateNotificationOffsetModal", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
