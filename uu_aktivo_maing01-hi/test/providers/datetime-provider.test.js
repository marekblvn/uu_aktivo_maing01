import { Test, VisualComponent } from "uu5g05-test";
import DatetimeProvider from "../../src/providers/datetime-provider.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(DatetimeProvider, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Providers.DatetimeProvider", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
