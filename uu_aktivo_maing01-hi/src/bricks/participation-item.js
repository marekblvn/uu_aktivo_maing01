//@@viewOn:imports
import { createVisualComponent, PropTypes, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Box, RichIcon } from "uu5g05-elements";
import { PersonItem } from "uu_plus4u5g02-elements";
import { useAuthorization } from "../contexts/authorization-context.js";
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

const ParticipationItem = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ParticipationItem",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    uuIdentity: PropTypes.string,
    colorScheme: PropTypes.colorScheme,
    icon: PropTypes.icon,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    uuIdentity: "",
    colorScheme: "neutral",
    icon: "empty",
  },
  //@@viewOff:defaultProps

  render({ uuIdentity, colorScheme, icon }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { isAuthority, isExecutive } = useAuthorization();
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Box
        shape="interactiveElement"
        colorScheme={colorScheme}
        significance="common"
        borderRadius="moderate"
        style={{ padding: "3px 4px 3px 12px", margin: "4px 0" }}
      >
        <RichIcon
          size={["xl", "l", "m"].includes(screenSize) ? "m" : "s"}
          icon={icon}
          margin={{ right: "12px" }}
          colorScheme={colorScheme}
          significance="subdued"
        />
        <PersonItem
          size={["xl", "l", "m"].includes(screenSize) ? "m" : "s"}
          uuIdentity={uuIdentity}
          subtitle={isAuthority || isExecutive ? uuIdentity : null}
        />
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ParticipationItem };
export default ParticipationItem;
//@@viewOff:exports
