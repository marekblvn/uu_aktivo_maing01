import { Test } from "uu5g05-test";
import AuthorizationContext from "../../src/contexts/authorization-context.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  props = { ...getDefaultProps(), ...props };
  const view = Test.render(<AuthorizationContext {...props} />, opts);
  return { view, props };
}

describe("UuAktivo.Contexts.AuthorizationContext", () => {
  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
