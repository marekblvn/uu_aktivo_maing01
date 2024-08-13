//@@viewOn:imports
import { createVisualComponent, useRoute } from "uu5g05";
import Config from "./config/config.js";
import { Box, Text } from "uu5g05-elements";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  box: () =>
    Config.Css.css({
      display: "flex",
      alignItems: "center",
      backgroundColor: "transparent",
    }),
  text: () =>
    Config.Css.css({
      fontFamily: "'Josefin Sans', sans-serif",
      fontOpticalSizing: "auto",
      fontWeight: 500,
      fontStyle: "normal",
      color: "#fafafa",
      lineHeight: "40px",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const Logo = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Logo",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    const [, setRoute] = useRoute();
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Box onClick={() => setRoute("")} className={Css.box()} shape="background">
        <Text category="interface" segment="title" type="main" className={Css.text()}>
          ⚡Aktivo
        </Text>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Logo };
export default Logo;
//@@viewOff:exports
