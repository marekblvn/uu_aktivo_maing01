//@@viewOn:imports
import { createVisualComponent, useScreenSize, Utils } from "uu5g05";
import { Text } from "uu5g05-elements";
import Config from "./config/config.js";
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

const PageHeader = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "PageHeader",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { content } = props;
    const [screenSize] = useScreenSize();
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props, Css.main(props));

    return (
      <div {...attrs}>
        <Text
          category="interface"
          segment="title"
          type={screenSize === "xs" ? "minor" : screenSize === "s" ? "common" : "major"}
          style={{ color: "#191919" }}
        >
          {content}
        </Text>
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { PageHeader };
export default PageHeader;
//@@viewOff:exports
