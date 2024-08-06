//@@viewOn:imports
import { createVisualComponent, PropTypes, useScreenSize, Utils } from "uu5g05";
import Config from "./config/config.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: (size) =>
    Config.Css.css({
      width: "100%",
      ...(["l", "xl"].includes(size) && {
        maxWidth: "1000px",
      }),
      padding: "0 16px 0",
      margin: "0 auto",
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
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { children } = props;
    const attrs = Utils.VisualComponent.getAttrs(props, Css.main(props));
    //@@viewOff:private

    //@@viewOn:render
    return (
      <div className={Css.main(screenSize)} {...attrs}>
        {children}
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Container };
export default Container;
//@@viewOff:exports
