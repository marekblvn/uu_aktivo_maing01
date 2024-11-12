//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Grid, Text } from "uu5g05-elements";
import importLsi from "../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  aktivoLogo: () =>
    Config.Css.css({
      fontFamily: "'Josefin Sans', sans-serif",
      fontOpticalSizing: "auto",
      fontWeight: 600,
      fontStyle: "normal",
      display: "inline",
      color: "#f5f5f5",
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
      <Grid
        templateRows={{ xs: "100%" }}
        templateColumns={{ xs: "100%" }}
        justifyItems={{ xs: "center" }}
        alignItems={{ xs: "center" }}
        style={{
          height: "156px",
          paddingBottom: "16px",
          background: "rgb(33,150,243)",
          background:
            "linear-gradient(180deg, rgba(33,150,243,1) 51%, rgba(82,173,246,1) 74%, rgba(255,255,255,0.9668461134453782) 100%)",
        }}
      >
        <Text
          category="story"
          segment="heading"
          type={["xs"].includes(screenSize) ? "h3" : "h1"}
          style={{ color: "#f9f9f9" }}
        >
          <Lsi import={importLsi} path={["Home", "welcome"]} />
          &nbsp;
          <div className={Css.aktivoLogo()}>Aktivo</div>!
        </Text>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { WelcomeHeader };
export default WelcomeHeader;
//@@viewOff:exports
