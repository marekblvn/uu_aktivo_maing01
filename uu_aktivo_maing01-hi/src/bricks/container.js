//@@viewOn:imports
import { createVisualComponent, PropTypes, useScreenSize, Utils } from "uu5g05";
import Config from "./config/config.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: (size, style) =>
    Config.Css.css({
      width: "100%",
      ...(["l", "xl"].includes(size) && {
        maxWidth: "1000px",
      }),
      padding: "0 16px 0",
      margin: "0 auto",
      ...style,
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const Container = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Container",
  nestingLevel: ["areaCollection", "area"],
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ children, style }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    //@@viewOff:private

    //@@viewOn:render
    return <div className={Css.main(screenSize, style)}>{children}</div>;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Container };
export default Container;
//@@viewOff:exports
