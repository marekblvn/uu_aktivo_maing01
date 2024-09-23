//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Block, Grid, Icon, Text } from "uu5g05-elements";
//@@viewOff:imports

//@@viewOn:constants
const questions = [
  {
    label: {
      en: "How can I create an activity?",
      cs: "Jak si můžu vytvořit aktivitu?",
    },
    content: {
      en: 'To create an activity you first need to be logged in to the Plus4U service. Then you can go to the "My Activities" tab and create activity from there, or you can click the link in the text above. After you create your activity, it will be available in the "My Activities" tab.',
      cs: "K vytvoření aktivity musíte být nejprve přihlášeni do služby Plus4U. Poté můžete přejít na záložku „Moje aktivity“ a vytvořit aktivitu odtud, nebo můžete kliknout na odkaz v textu výše. Po vytvoření aktivity bude tato dostupná v záložce „Moje aktivity“.",
    },
  },
  {
    label: {
      en: "How can I disable / enable email notifications?",
      cs: "Jak můžu zrušit / povolit posílání upozornění na e-mail?",
    },
    content: {
      en: 'Notifications are sent only to those members, who have their email address set up in the particular activity. If the user does not have an email address set up in the activity, then no notification is sent to them. In the activity "Members" tab, you can click on the button next to your name to change the email for the activity or to set that you do not want to receive email notifications.',
      cs: "Oznámení jsou zasílána pouze těm členům, kteří mají v dané aktivitě nastavenou e-mailovou adresu. Pokud uživatel nemá v aktivitě nastavenou e-mailovou adresu, není mu zasláno žádné oznámení. V aktivitě v kartě „Členové“ můžete kliknutím na tlačítko vedle svého jména změnit e-mail pro danou aktivitu nebo nastavit, že nechcete dostávat e-mailová oznámení.",
    },
  },
];
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: (props) => Config.Css.css({}),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const WelcomeQuestions = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "WelcomeQuestions",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    //@@viewOff:private

    function renderQuestions() {
      return questions.map((q, idx) => {
        const { label, content } = q;
        return (
          <Block
            key={idx}
            card="full"
            colorScheme="neutral"
            significance="distinct"
            header={
              <Text
                category="interface"
                segment="content"
                type={["xl", "l", "m"].includes(screenSize) ? "large" : "medium"}
                style={{
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontOpticalSizing: "auto",
                  fontWeight: 600,
                  textAlign: "justify",
                }}
              >
                <Icon icon="uugds-help-circle-solid" margin="0 8px 0 0" />
                <Lsi lsi={label} />
              </Text>
            }
          >
            <Text
              category="interface"
              segment="content"
              type={["xl", "l", "m"].includes(screenSize) ? "large" : "medium"}
              style={{
                fontFamily: "'Red Hat Display', sans-serif",
                fontOpticalSizing: "auto",
                textAlign: "justify",
              }}
            >
              <Lsi lsi={content} />
            </Text>
          </Block>
        );
      });
    }

    //@@viewOn:render
    return (
      <Grid style={{ padding: ["xl", "l", "m"].includes(screenSize) ? "0 48px" : "0 24px" }}>
        <Text
          category="interface"
          segment="content"
          type={["xl", "l", "m"].includes(screenSize) ? "large" : "medium"}
          autoFit
          style={{ fontFamily: "'Red Hat Display', sans-serif", fontOpticalSizing: "auto", textAlign: "justify" }}
        >
          <Lsi lsi={{ en: "Now you're maybe asking:", cs: "Teď se možná ptáte:" }} />
        </Text>
        {renderQuestions()}
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { WelcomeQuestions };
export default WelcomeQuestions;
//@@viewOff:exports
