//@@viewOn:imports
import { createVisualComponent, Lsi, PropTypes, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Box, Grid, RichIcon, Text } from "uu5g05-elements";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  stats: (props) =>
    Config.Css.css({
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      paddingRight: "8px",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const ParticipationStatusBlock = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ParticipationStatusBlock",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    minParticipants: PropTypes.number,
    idealParticipants: PropTypes.number,
    confirmedCount: PropTypes.number,
    deniedCount: PropTypes.number,
    undecidedCount: PropTypes.number,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    minParticipants: 0,
    idealParticipants: 0,
    confirmedCount: 0,
    deniedCount: 0,
    undecidedCount: 0,
  },
  //@@viewOff:defaultProps

  render({ minParticipants, idealParticipants, confirmedCount, deniedCount, undecidedCount }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();

    const conditionalCsLsi = (() => {
      switch (confirmedCount) {
        case 1:
          return `Přijde ${confirmedCount} člen`;
        case 2:
        case 3:
        case 4:
          return `Přijdou ${confirmedCount} členové`;
        default:
          return `Přijde ${confirmedCount} členů`;
      }
    })();

    const colorScheme = (() => {
      if (minParticipants === 0 && idealParticipants === 0) return "neutral";
      if (confirmedCount < minParticipants) return "negative";
      if (confirmedCount >= idealParticipants) return "positive";
      return "warning";
    })();

    const icon = (() => {
      switch (colorScheme) {
        case "positive":
          return "uubmlstencil-uubmltemporary-smile-happy";
        case "negative":
          return "uubmlstencil-uubmltemporary-smile-sad";
        case "warning":
          return "uubmlstencil-uubmltemporary-smile-neutral";
      }
    })();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Grid templateColumns={{ xs: "auto auto" }} templateRows={{ xs: "100%" }} justifyContent="space-between">
        <Grid
          templateColumns={{ xs: "auto auto" }}
          templateRows={{ xs: "100%" }}
          columnGap={"4px"}
          alignItems="center"
          justifyContent="start"
        >
          {colorScheme !== "neutral" && (
            <RichIcon
              icon={icon}
              colorScheme={colorScheme}
              significance="subdued"
              size={["xs", "s"].includes(screenSize) ? "s" : "m"}
            />
          )}
          <Text
            category="story"
            segment="body"
            type={["xs", "s"].includes(screenSize) ? "minor" : "common"}
            colorScheme={colorScheme}
          >
            <Lsi
              lsi={{
                en: `${confirmedCount} member${confirmedCount === 1 ? "" : "s"} confirmed`,
                cs: conditionalCsLsi,
              }}
            />
          </Text>
        </Grid>
        <Grid alignItems="center" templateColumns={{ xs: "100%" }} templateRows={{ xs: "100%" }}>
          <Text
            category="story"
            segment="body"
            type={["xs", "s"].includes(screenSize) ? "minor" : "common"}
            bold
            colorScheme="neutral"
            significance="subdued"
            style={{ paddingRight: "8px" }}
          >
            <span style={{ color: "rgb(56, 142, 60)" }}>{confirmedCount}</span>/
            <span style={{ color: "rgb(97, 97, 97)" }}>{undecidedCount}</span>/
            <span style={{ color: "rgb(229, 57, 53)" }}>{deniedCount}</span>&nbsp;
            <span style={{ color: "rgba(0, 0, 0, 0.7)" }}>({confirmedCount + undecidedCount + deniedCount})</span>
          </Text>
        </Grid>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ParticipationStatusBlock };
export default ParticipationStatusBlock;
//@@viewOff:exports
