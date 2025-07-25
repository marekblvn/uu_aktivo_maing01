//@@viewOn:imports
import { createVisualComponent, Lsi, PropTypes, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { ActionGroup, Box, DateTime, Grid, Text } from "uu5g05-elements";
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

const InvitationCard = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "InvitationCard",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.object,
    onInvitationAccept: PropTypes.func,
    onInvitationDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    data: {},
    onInvitationAccept: () => {},
    onInvitationDelete: () => {},
  },
  //@@viewOff:defaultProps

  render({ data, onInvitationAccept, onInvitationDelete }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const itemList = [
      {
        icon: "uugds-check",
        onClick: onInvitationAccept,
        colorScheme: "positive",
        significance: "subdued",
        children: <Lsi lsi={{ en: "Accept", cs: "Přijmout" }} />,
      },
      {
        icon: "uugds-close",
        onClick: onInvitationDelete,
        colorScheme: "negative",
        significance: "subdued",
        children: <Lsi lsi={{ en: "Reject", cs: "Odmítnout" }} />,
      },
    ];
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Box borderRadius="moderate" style={{ padding: "8px 16px" }}>
        <Grid templateColumns={{ xs: "auto auto" }} templateRows={{ xs: "100%" }}>
          <Grid
            templateColumns={{ xs: "100%", m: "auto auto" }}
            templateRows={{ xs: "1fr 1fr", m: "100%" }}
            alignItems="center"
            rowGap="2px"
          >
            <Text category="interface" segment="content" type="medium" bold={!["xs", "s"].includes(screenSize)}>
              {data.activityName}
            </Text>
            <Text
              category="interface"
              segment="content"
              type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
              colorScheme="neutral"
            >
              <DateTime value={data.createdAt} />
            </Text>
          </Grid>
          <ActionGroup itemList={itemList} />
        </Grid>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { InvitationCard };
export default InvitationCard;
//@@viewOff:exports
