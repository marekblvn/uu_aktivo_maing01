//@@viewOn:imports
import { createVisualComponent, Lsi, PropTypes, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { ActionGroup, DateTime, Grid, RichIcon, Text } from "uu5g05-elements";
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
  propTypes: {
    datetime: PropTypes.string,
    onClickDownload: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    datetime: "",
    onClickDownload: () => {},
  },
  //@@viewOff:defaultProps

  render({ datetime, onClickDownload }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Grid
        templateRows={{ xs: "100%" }}
        templateColumns={{ xs: "auto 36px" }}
        style={{
          backgroundColor: "rgb(208, 239, 236)",
          color: "rgb(0, 150, 136)",
          padding: "4px 6px",
          borderRadius: "8px",
        }}
      >
        <Grid
          templateColumns={{ xs: "36px auto", s: "auto auto" }}
          justifyContent={{ xs: "start", s: "space-between" }}
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
                <Lsi lsi={{ en: "Upcoming datetime", cs: "Nadcházející termín" }} />
              </Text>
            )}
          </Grid>
          <Text
            category="story"
            segment="body"
            type={`${["xs", "s"].includes(screenSize) ? "minor" : "common"}`}
            bold
            style={{ textAlign: "right" }}
          >
            <DateTime
              value={datetime}
              dateFormat={["xs", "m"].includes(screenSize) ? "medium" : "long"}
              timeFormat="medium"
            />
          </Text>
        </Grid>
        <ActionGroup
          itemList={[
            {
              icon: "uugdsstencil-media-qr-code",
              onClick: onClickDownload,
              colorScheme: "secondary",
              significance: "common",
            },
          ]}
        />
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DateBlock };
export default DateBlock;
//@@viewOff:exports
