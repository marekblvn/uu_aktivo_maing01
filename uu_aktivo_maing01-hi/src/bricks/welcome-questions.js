//@@viewOn:imports
import { createVisualComponent, Lsi, PropTypes, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Block, Grid, Icon, Text } from "uu5g05-elements";
//@@viewOff:imports

//@@viewOn:constants
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
  propTypes: {
    questions: PropTypes.arrayOf(PropTypes.object),
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    questions: [],
  },
  //@@viewOff:defaultProps

  render({ questions }) {
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
