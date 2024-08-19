//@@viewOn:imports
import { createVisualComponent, useScreenSize, Utils } from "uu5g05";
import Config from "./config/config.js";
import { Grid, Number, Text } from "uu5g05-elements";
import { PersonItem, PersonPhoto } from "uu_plus4u5g02-elements";
import { Environment } from "uu_plus4u5g02";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  firstCol: () =>
    Config.Css.css({
      backgroundColor: "rgba(0,0,0,0.02)",
      padding: "8px 16px",
      height: "100%",
      width: "100%",
      borderTop: "solid 1px rgba(0,0,0,0.1)",
    }),
  nthCol: (position, screenSize) =>
    Config.Css.css({
      backgroundColor: `${position % 2 === 0 ? "rgba(0,0,0,0.02)" : "rgba(0,0,0,0)"}`,
      height: "100%",
      width: "100%",
      display: screenSize === "xs" ? "grid" : "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "8px 0",
      borderTop: "solid 1px rgba(0,0,0,0.1)",
      textAlign: "center",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const AttendanceItem = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AttendanceItem",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ data }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { uuIdentity, confirmedCount, undecidedCount, deniedCount, total } = data;
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Grid templateColumns={{ xs: "repeat(5,1fr)" }} alignItems="center" columnGap={0}>
        <div
          className={Css.firstCol()}
          style={
            ["xs", "s"].includes(screenSize) ? { display: "flex", justifyContent: "center", alignItems: "center" } : {}
          }
        >
          {["xs", "s"].includes(screenSize) ? (
            <PersonPhoto
              uuIdentity={uuIdentity}
              height={screenSize === "s" ? 32 : 22}
              borderRadius={screenSize === "xs" ? "none" : "moderate"}
            />
          ) : (
            <PersonItem
              uuIdentity={uuIdentity}
              size={["xl", "l"].includes(screenSize) ? "l" : "s"}
              borderRadius="moderate"
            />
          )}
        </div>
        <div className={Css.nthCol(1, screenSize)}>
          <Text
            category="interface"
            segment="content"
            type={["xl", "l"].includes(screenSize) ? "medium" : "small"}
            style={{ padding: "0 4px" }}
          >
            {confirmedCount}
          </Text>
          <Text
            category="interface"
            segment="content"
            type={["xl", "l"].includes(screenSize) ? "medium" : "small"}
            style={{ padding: "0 4px" }}
          >
            ({Math.round((confirmedCount / total) * 100)}%)
          </Text>
        </div>
        <div className={Css.nthCol(2, screenSize)}>
          <Text
            category="interface"
            segment="content"
            type={["xl", "l"].includes(screenSize) ? "medium" : "small"}
            style={{ padding: "0 4px" }}
          >
            {undecidedCount}
          </Text>
          <Text
            category="interface"
            segment="content"
            type={["xl", "l"].includes(screenSize) ? "medium" : "small"}
            style={{ padding: "0 4px" }}
          >
            ({Math.round((undecidedCount / total) * 100)}%)
          </Text>
        </div>
        <div className={Css.nthCol(3, screenSize)}>
          <Text category="interface" segment="content" type={["xl", "l"].includes(screenSize) ? "medium" : "small"}>
            {deniedCount}
          </Text>
          <Text
            category="interface"
            segment="content"
            type={["xl", "l"].includes(screenSize) ? "medium" : "small"}
            style={{ padding: "0 4px" }}
          >
            ({Math.round((deniedCount / total) * 100)}%)
          </Text>
        </div>
        <div className={Css.nthCol(4, screenSize)}>
          <Text category="interface" segment="content" type={["xl", "l"].includes(screenSize) ? "medium" : "small"}>
            {total}
          </Text>
        </div>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AttendanceItem };
export default AttendanceItem;
//@@viewOff:exports
