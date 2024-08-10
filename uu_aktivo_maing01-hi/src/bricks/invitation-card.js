//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize, useTimeZone } from "uu5g05";
import Config from "./config/config.js";
import { ActionGroup, Box, ButtonGroup, DateTime, Text } from "uu5g05-elements";
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
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ data, onInvitationAccept, onInvitationDelete }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const [timeZone] = useTimeZone();
    const buttonGroupList = [
      {
        children: <Lsi lsi={{ en: "Accept", cs: "Přijmout" }} />,
        icon: "mdi-check",
        onClick: onInvitationAccept,
        colorScheme: "positive",
        significance: "common",
      },
      {
        children: <Lsi lsi={{ en: "Decline", cs: "Odmítnout" }} />,
        icon: "mdi-close",
        onClick: onInvitationDelete,
        colorScheme: "negative",
        significance: "common",
      },
    ];

    const iconGroupList = [
      {
        icon: "mdi-check",
        onClick: onInvitationAccept,
      },
      {
        icon: "mdi-close",
        onClick: onInvitationDelete,
      },
    ];
    //@@viewOff:private

    function provideButtonGroupList(screenSize) {
      if (screenSize === "s") {
        return iconGroupList;
      }
      return buttonGroupList;
    }

    //@@viewOn:render
    return (
      <Box
        style={{
          display: ["xs"].includes(screenSize) ? "grid" : "flex",
          justifyContent: ["xs"].includes(screenSize) ? "center" : "space-between",
          alignItems: "center",
          padding: ["xs"].includes(screenSize) ? "16px 24px" : "10px 10px 10px 16px",
          borderRadius: "8px",
          rowGap: "16px",
        }}
        shape="ground"
        colorScheme="neutral"
        width="100%"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: "16px",
            justifyContent: ["xs"].includes(screenSize) ? "space-between" : "center",
          }}
        >
          <Text
            category="interface"
            segment="content"
            type={`${["xs", "s"].includes(screenSize) ? "medium" : "large"}`}
            autoFit
            bold
            colorScheme="neutral"
            significance="common"
          >
            {data.activityName}
          </Text>
          <Text
            category="interface"
            segment="content"
            type={`${["xs", "s"].includes(screenSize) ? "small" : "medium"}`}
            autoFit
          >
            <DateTime
              value={data.createdAt}
              timeZone={timeZone}
              timeFormat="short"
              dateFormat="short"
              style={{ paddingRight: "8px", textAlign: ["xs"].includes(screenSize) ? "right" : "left" }}
            />
          </Text>
        </div>
        {["xl", "l", "m", "s"].includes(screenSize) ? (
          <ActionGroup
            colorScheme="neutral"
            significance="subdued"
            itemList={buttonGroupList}
            size={screenSize === "xl" ? "l" : screenSize}
            alignment="right"
          />
        ) : (
          <ButtonGroup itemList={provideButtonGroupList(screenSize)} size={screenSize === "xs" ? "m" : screenSize} />
        )}
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { InvitationCard };
export default InvitationCard;
//@@viewOff:exports
