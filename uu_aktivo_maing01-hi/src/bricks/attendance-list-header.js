//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Grid, RichIcon, Text } from "uu5g05-elements";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  firstCol: () =>
    Config.Css.css({
      backgroundColor: "rgba(0,0,0,0.02)",
      padding: "8px 0 8px 16px",
      borderBottom: "solid 1px rgba(0,0,0,0.4)",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
    }),
  nthCol: (position) =>
    Config.Css.css({
      backgroundColor: `${position % 2 === 0 ? "rgba(0,0,0,0.02)" : "rgba(0,0,0,0)"}`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "8px 0",
      borderBottom: "solid 1px rgba(0,0,0,0.4)",
      fontWeight: 700,
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const AttendanceListHeader = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AttendanceListHeader",
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
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Grid templateColumns={{ xs: "repeat(5,1fr)" }} columnGap={0}>
        <div
          className={Css.firstCol()}
          style={
            ["xs", "s"].includes(screenSize)
              ? {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 0,
                }
              : {}
          }
        >
          {["xs", "s"].includes(screenSize) ? (
            <RichIcon icon="mdi-account" size="m" significance="subdued" />
          ) : (
            <Text
              category="interface"
              segment="content"
              type={["xl", "l"].includes(screenSize) ? "medium" : "small"}
              bold
            >
              <Lsi lsi={{ en: "Member", cs: "Člen" }} />
            </Text>
          )}
        </div>
        <div className={Css.nthCol(1)}>
          <RichIcon
            icon="uugdsstencil-communication-thumb-up"
            size={["xs", "s"].includes(screenSize) ? "s" : "xxs"}
            colorScheme="positive"
            significance="subdued"
          />
          {["xs", "s"].includes(screenSize) || (
            <Text
              category="interface"
              segment="content"
              type={["xl", "l"].includes(screenSize) ? "medium" : "small"}
              bold
            >
              <Lsi lsi={{ en: "Came", cs: "Přišel/la" }} />
            </Text>
          )}
        </div>
        <div className={Css.nthCol(2)}>
          <RichIcon
            icon="uugds-help"
            size={["xs", "s"].includes(screenSize) ? "s" : "xxs"}
            colorScheme="neutral"
            significance="subdued"
          />
          {["xs", "s"].includes(screenSize) || (
            <Text
              category="interface"
              segment="content"
              type={["xl", "l"].includes(screenSize) ? "medium" : "small"}
              bold
            >
              <Lsi lsi={{ en: "Did not decide", cs: "Nerozhodl/la se" }} />
            </Text>
          )}
        </div>
        <div className={Css.nthCol(3)}>
          <RichIcon
            icon="uugdsstencil-communication-thumb-down"
            size={["xs", "s"].includes(screenSize) ? "s" : "xxs"}
            colorScheme="negative"
            significance="subdued"
          />
          {["xs", "s"].includes(screenSize) || (
            <Text
              category="interface"
              segment="content"
              type={["xl", "l"].includes(screenSize) ? "medium" : "small"}
              bold
            >
              <Lsi lsi={{ en: "Didn't come", cs: "Nepřišel/la" }} />
            </Text>
          )}
        </div>
        <div className={Css.nthCol(4)}>
          {["xs", "s"].includes(screenSize) ? (
            <RichIcon icon="uugdsstencil-commerce-sum" size="s" colorScheme="building" significance="subdued" />
          ) : (
            <Text
              category="interface"
              segment="content"
              type={["xl", "l"].includes(screenSize) ? "medium" : "small"}
              bold
            >
              <Lsi lsi={{ en: "Datetimes passed", cs: "Proběhlých termínů" }} />
            </Text>
          )}
        </div>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AttendanceListHeader };
export default AttendanceListHeader;
//@@viewOff:exports
