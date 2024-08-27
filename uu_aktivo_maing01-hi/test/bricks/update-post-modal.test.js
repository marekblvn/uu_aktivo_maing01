import { Test, VisualComponent } from "uu5g05-test";
import UpdatePostModal from "../../src/bricks/update-post-modal.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(UpdatePostModal, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.UpdatePostModal", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
