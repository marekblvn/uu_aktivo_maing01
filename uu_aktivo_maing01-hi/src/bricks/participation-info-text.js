//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize, Utils } from "uu5g05";
import Config from "./config/config.js";
import { Box, Grid, Icon, RichIcon, Text } from "uu5g05-elements";
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

const ParticipationInfoText = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ParticipationInfoText",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    value: 0,
    minParticipants: 0,
    idealParticipants: 0,
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

    const leftTextType = (() => {
      if (["xl", "l"].includes(screenSize)) return "large";
      return "medium";
    })();

    const rightTextType = (() => {
      if (["xl", "l"].includes(screenSize)) return "large";
      if (screenSize === "m") return "medium";
      return "small";
    })();

    const iconSize = (() => {
      if (["xl", "l"].includes(screenSize)) return "l";
      if (["m", "s"].includes(screenSize)) return "m";
      return "s";
    })();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Grid templateColumns={{ xs: "4fr 2fr" }} rowGap={0}>
        <Box shape="interactiveElement" significance="subdued" colorScheme={colorScheme}>
          {colorScheme !== "neutral" && (
            <RichIcon icon={icon} colorScheme={colorScheme} significance="subdued" size={iconSize} />
          )}
          <Text category="interface" segment="content" type={leftTextType} bold>
            <Lsi
              lsi={{ en: `${confirmedCount} member${confirmedCount === 1 ? "" : "s"} will come`, cs: conditionalCsLsi }}
            />
          </Text>
        </Box>
        <Box shape="interactiveElement" significance="subdued" className={Css.stats()}>
          <Text category="interface" segment="content" type={rightTextType} bold>
            <span style={{ color: "rgb(56, 142, 60)" }}>{confirmedCount}</span>/
            <span style={{ color: "rgb(97, 97, 97)" }}>{undecidedCount}</span>/
            <span style={{ color: "rgb(229, 57, 53)" }}>{deniedCount}</span>&nbsp;
            <span>({confirmedCount + undecidedCount + deniedCount})</span>
          </Text>
        </Box>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ParticipationInfoText };
export default ParticipationInfoText;
//@@viewOff:exports
