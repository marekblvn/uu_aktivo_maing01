//@@viewOn:imports
import { createVisualComponent, Lsi, useState } from "uu5g05";
import Config from "./config/config.js";
import { Box, CollapsibleBox, Grid, Icon, Text } from "uu5g05-elements";
import MemberItem from "./member-item.js";
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

const MemberList = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "MemberList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    collapsible: false,
  },
  //@@viewOff:defaultProps

  render({
    items,
    lsiTitle,
    colorScheme,
    icon,
    iconColor,
    collapsible,
    onRemoveMember,
    onPromoteAdmin,
    onDemoteAdmin,
    onLeaveActivity,
  }) {
    //@@viewOn:private
    const [collapsed, setCollapsed] = useState(collapsible);
    const titleProps = collapsible ? { onClick: () => setCollapsed(!collapsed) } : {};
    //@@viewOff:private

    //@@viewOn:render

    function renderItems() {
      if (items) {
        const itemComponents = items.map((item, idx) => (
          <MemberItem
            key={idx}
            uuIdentity={item}
            colorScheme={colorScheme}
            onLeaveActivity={onLeaveActivity}
            onRemoveMember={onRemoveMember}
            onPromoteAdmin={onPromoteAdmin}
            onDemoteAdmin={onDemoteAdmin}
          />
        ));
        if (collapsible) {
          return (
            <CollapsibleBox style={{ display: "grid", rowGap: "4px" }} collapsed={collapsed}>
              {itemComponents}
            </CollapsibleBox>
          );
        } else return itemComponents;
      }
      return null;
    }

    return (
      <Grid rowGap="8px" templateColumns="1fr" templateRows="auto auto">
        <Box
          style={{ display: "flex", columnGap: "4px", alignItems: "center" }}
          shape="interactiveItem"
          significance="common"
          colorScheme="building"
          {...titleProps}
        >
          <Icon icon={icon} style={{ color: iconColor }} />
          <Text category="interface" segment="highlight" type="common" autoFit>
            <Lsi lsi={lsiTitle} />
            {items && items.length > 1 ? ` (${items.length})` : ""}
          </Text>
          {collapsible && items.length > 0 && <Icon icon={collapsed ? "mdi-chevron-down" : "mdi-chevron-up"} />}
        </Box>
        <Grid templateColumns="1fr">{renderItems()}</Grid>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { MemberList };
export default MemberList;
//@@viewOff:exports
