//@@viewOn:imports
import { createVisualComponent, PropTypes, useState, Utils } from "uu5g05";
import Config from "./config/config.js";
import { Box } from "uu5g05-elements";
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

const TextBox = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "TextBox",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    content: PropTypes.string,
    previewLength: PropTypes.number,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    content: "",
    previewLength: 100,
  },
  //@@viewOff:defaultProps

  render({ content, previewLength }) {
    //@@viewOn:private
    const shouldBeCollapsible = content.length > previewLength;
    const [collapsed, setCollapsed] = useState(true);
    //@@viewOff:private

    //@@viewOn:render
    const renderContent = () => {
      if (shouldBeCollapsible) {
        if (collapsed) {
          return content.slice(0, previewLength) + "...";
        } else {
          return content;
        }
      } else {
        return content;
      }
    };

    return (
      <Box
        shape="background"
        significance="subdued"
        onClick={shouldBeCollapsible ? () => setCollapsed(!collapsed) : null}
      >
        <div style={{ display: "block", textAlign: "left" }}>{renderContent()}</div>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { TextBox };
export default TextBox;
//@@viewOff:exports
