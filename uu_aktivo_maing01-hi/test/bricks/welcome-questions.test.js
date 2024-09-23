import { Test, VisualComponent } from "uu5g05-test";
import WelcomeQuestions from "../../src/bricks/welcome-questions.js";

function getDefaultProps() {
  return {
    children: "Test content",
  };
}

async function setup(props = {}, opts) {
  return VisualComponent.setup(WelcomeQuestions, { ...getDefaultProps(), ...props }, opts);
}

describe("UuAktivo.Bricks.WelcomeQuestions", () => {
  VisualComponent.testProperties(setup);

  it("checks default property values", async () => {
    await setup();

    expect(Test.screen.getByText("Test content")).toBeInTheDocument();
  });
});
