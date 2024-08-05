//@@viewOn:imports
import { createVisualComponent, useRoute, useScreenSize } from "uu5g05";
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
      height: "56px",
      padding: "8px 16px",
    }),
  text: () =>
    Config.Css.css({
      fontFamily: "'Josefin Sans', sans-serif",
      fontOpticalSizing: "auto",
      fontWeight: 500,
      fontStyle: "normal",
      color: "#fafafa",
      letterSpacing: "1.5px",
      marginTop: "4px",
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
    const [screenSize] = useScreenSize();
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Box shape="interactiveElement" colorScheme="primary" onClick={() => setRoute("")} className={Css.box()}>
        <Text category="expose" segment="default" type="broad" className={Css.text()} autoFit>
          Aktivo
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
