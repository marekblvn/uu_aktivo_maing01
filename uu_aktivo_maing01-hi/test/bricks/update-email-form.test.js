import { Test, VisualComponent } from "uu5g05-test";
import UpdateEmailForm from "../../src/bricks/update-email-form.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(UpdateEmailForm, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.UpdateEmailForm", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
