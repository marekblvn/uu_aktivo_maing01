//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize, useTimeZone } from "uu5g05";
import Config from "./config/config.js";
import { DateTime, Grid, ListItem, RichIcon, Text } from "uu5g05-elements";
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

const DateBlock = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DateBlock",
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
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Grid
        templateColumns={{ xs: "auto auto" }}
        justifyContent={{ xs: "start", s: "space-between" }}
        style={{
          backgroundColor: "rgb(208, 239, 236)",
          color: "rgb(0, 150, 136)",
          padding: "4px 16px 4px 6px",
          borderRadius: "8px",
        }}
        alignItems="center"
        columnGap={{ xs: "4px" }}
      >
        <Grid
          templateRows={{ xs: "100%" }}
          columnGap={{ xs: "12px", s: "16px" }}
          templateColumns={{ xs: "36px", s: "25px 1fr" }}
          alignItems="center"
        >
          <RichIcon icon="uugdsstencil-time-calendar-time" colorScheme="secondary" significance="subdued" />
          {screenSize !== "xs" && (
            <Text category="story" segment="body" type={["xs", "s"].includes(screenSize) ? "minor" : "common"}>
              <Lsi lsi={{ en: "Upcoming date", cs: "Nadcházející datum" }} />
            </Text>
          )}
        </Grid>
        <Text category="story" segment="body" type={`${["xs", "s"].includes(screenSize) ? "minor" : "common"}`} bold>
          <DateTime value={datetime} dateFormat="long" timeFormat="medium" />
        </Text>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DateBlock };
export default DateBlock;
//@@viewOff:exports
