//@@viewOn:imports
import { createVisualComponent, Lsi, PropTypes, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Grid, Link, Text } from "uu5g05-elements";
import importLsi from "../lsi/import-lsi.js";
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

const WelcomeContent = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "WelcomeContent",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onCreateActivity: PropTypes.func.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onCreateActivity: () => {},
  },
  //@@viewOff:defaultProps

  render({ onCreateActivity }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Grid
        templateRows={{ xs: "repeat(3, auto)" }}
        templateColumns={{ xs: "100%" }}
        style={{ padding: ["xl", "l", "m"].includes(screenSize) ? "0 48px" : "0 24px" }}
      >
        <Text
          category="interface"
          segment="content"
          type={["xl", "l", "m"].includes(screenSize) ? "large" : "medium"}
          style={{ fontFamily: "'Red Hat Display', sans-serif", fontOpticalSizing: "auto", textAlign: "justify" }}
        >
          <Lsi import={importLsi} path={["Home", "intro1"]} />
        </Text>
        <Text
          category="interface"
          segment="content"
          type={["xl", "l", "m"].includes(screenSize) ? "large" : "medium"}
          autoFit
          style={{ fontFamily: "'Red Hat Display', sans-serif", fontOpticalSizing: "auto", textAlign: "justify" }}
        >
          <Lsi import={importLsi} path={["Home", "intro2"]} />
        </Text>
        <Text
          category="interface"
          segment="content"
          type={["xl", "l", "m"].includes(screenSize) ? "large" : "medium"}
          autoFit
          style={{ fontFamily: "'Red Hat Display', sans-serif", fontOpticalSizing: "auto", textAlign: "justify" }}
        >
          <Lsi lsi={{ en: "So don't hesitate and ", cs: "Tak neváhejte a " }} />
          <Link onClick={onCreateActivity}>
            <Lsi lsi={{ en: "create an activity", cs: "vytvořte si aktivitu" }} />
          </Link>
          .
        </Text>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { WelcomeContent };
export default WelcomeContent;
//@@viewOff:exports
