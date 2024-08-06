//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize, Utils } from "uu5g05";
import Config from "./config/config.js";
import { Text } from "uu5g05-elements";
import importLsi from "../lsi/import-lsi.js";
import Container from "./container.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: (props) =>
    Config.Css.css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#191919",
      textJustify: "auto",
    }),
  aktivoLogo: (screenSize) =>
    Config.Css.css({
      fontFamily: "'Josefin Sans', sans-serif",
      fontOpticalSizing: "auto",
      fontWeight: 600,
      fontStyle: "normal",
      display: "inline",
      color: "rgb(33, 150, 243)",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const WelcomeHeader = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "WelcomeHeader",
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

    //@@viewOn:render

    return (
      <Container
        style={{
          marginTop: "32px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          rowGap: "16px",
          color: "#191919",
          textAlign: "justify",
        }}
      >
        <Text category="story" segment="heading" type={["xs"].includes(screenSize) ? "h3" : "h1"}>
          <Lsi import={importLsi} path={["Home", "welcome"]} />
          &nbsp;
          <div className={Css.aktivoLogo()}>Aktivo</div>!
        </Text>
        <Text category="story" segment="body" type={["xs"].includes(screenSize) ? "minor" : "common"}>
          <Lsi import={importLsi} path={["Home", "intro"]} />
        </Text>
      </Container>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { WelcomeHeader };
export default WelcomeHeader;
//@@viewOff:exports
