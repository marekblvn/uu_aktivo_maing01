//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize, useTimeZone } from "uu5g05";
import Config from "./config/config.js";
import { DateTime, ListItem, Text } from "uu5g05-elements";
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

const DatetimeBlock = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DatetimeBlock",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ datetime }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const [timeZone] = useTimeZone();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <ListItem icon="uugdsstencil-time-calendar-time" colorScheme="secondary" significance="common">
        <Text
          category="interface"
          segment="content"
          type={`${["xl", "l"].includes(screenSize) ? "large" : screenSize === "m" ? "medium" : "small"}`}
          bold
          style={{ marginRight: "8px" }}
        >
          <Lsi lsi={{ en: "Activity date", cs: "Datum aktivity" }} />
        </Text>
        <Text
          category="interface"
          segment="content"
          type={`${["xl", "l"].includes(screenSize) ? "large" : screenSize === "m" ? "medium" : "small"}`}
          style={{ textAlign: "right", marginLeft: "auto", marginRight: screenSize === "xs" ? "0" : "4px" }}
        >
          <DateTime value={datetime} timeZone={timeZone} dateFormat="long" timeFormat="medium" />
        </Text>
      </ListItem>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DatetimeBlock };
export default DatetimeBlock;
//@@viewOff:exports
