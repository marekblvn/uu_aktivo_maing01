//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize, useSession } from "uu5g05";
import Config from "./config/config.js";
import { ActionGroup, Box, Grid, Text } from "uu5g05-elements";
import { PersonItem } from "uu_plus4u5g02-elements";
import { useActivityAuthorization } from "../contexts/activity-authorization-context.js";
import { useAuthorization } from "../contexts/authorization-context.js";
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

const MemberItem = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "MemberItem",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onRemoveMember: () => {},
    onPromoteAdmin: () => {},
    onDemoteAdmin: () => {},
    onLeaveActivity: () => {},
  },
  //@@viewOff:defaultProps

  render({ uuIdentity, colorScheme, onRemoveMember, onPromoteAdmin, onDemoteAdmin, onLeaveActivity }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { identity } = useSession();
    const { isAuthority, isExecutive } = useAuthorization();
    const { isOwner, isAdministrator, checkIfAdministrator, checkIfOwner } = useActivityAuthorization();
    //@@viewOff:private

    const leaveActivityAction = {
      order: 2,
      icon: "mdi-exit-run",
      children: <Lsi lsi={{ en: "Leave Activity", cs: "Opustit aktivitu" }} />,
      onClick: () => onLeaveActivity(),
      tooltip: { en: "Leave Activity", cs: "Opustit aktivitu" },
      collapsed: "always",
      colorScheme: "negative",
      significance: "common",
    };

    const promoteAdminAction = {
      icon: "mdi-star-plus",
      children: <Lsi lsi={{ en: "Promote to administrator", cs: "Povýšit na správce" }} />,
      onClick: () => onPromoteAdmin(uuIdentity),
      order: -1,
      tooltip: { en: "Promote to administrator", cs: "Povýšit na správce" },
      collapsed: ["xs", "s"].includes(screenSize),
      colorScheme: ["xs", "s"].includes(screenSize) ? "warning" : "neutral",
      significance: ["xs", "s"].includes(screenSize) ? "common" : "subdued",
    };

    const demoteAdminAction = {
      icon: "mdi-star-minus",
      children: <Lsi lsi={{ en: "Demote administrator", cs: "Odebrat správcovství" }} />,
      onClick: () => onDemoteAdmin(uuIdentity),
      order: 0,
      tooltip: { en: "Demote administrator", cs: "Odebrat správcovství" },
      collapsed: ["xs", "s"].includes(screenSize),
      colorScheme: "neutral",
      significance: ["xs", "s"].includes(screenSize) ? "common" : "subdued",
    };

    const removeMemberAction = {
      icon: "mdi-account-remove",
      children: <Lsi lsi={{ en: "Remove member", cs: "Odebrat člena" }} />,
      onClick: () => onRemoveMember(uuIdentity),
      order: 1,
      tooltip: { en: "Remove member", cs: "Odebrat člena" },
      collapsed: "always",
      colorScheme: "negative",
      significance: "common",
    };

    const itemList = (() => {
      const items = [];
      if (uuIdentity === identity.uuIdentity && !isOwner) {
        items.push(leaveActivityAction);
        return items;
      }
      if (checkIfOwner(uuIdentity)) return items;
      if (checkIfAdministrator(uuIdentity)) {
        if (isOwner || isAuthority || isExecutive) {
          items.push(demoteAdminAction);
          items.push(removeMemberAction);
          return items;
        }
        if (isAdministrator) {
          items.push(removeMemberAction);
          return items;
        }
      } else {
        if (isOwner || isAuthority || isExecutive) {
          items.push(removeMemberAction);
          items.push(promoteAdminAction);
          return items;
        }
        if (isAdministrator) {
          items.push(removeMemberAction);
          return items;
        }
      }
      return items;
    })();

    //@@viewOn:render
    return (
      <Box
        colorScheme={colorScheme}
        shape="ground"
        significance="distinct"
        borderRadius="moderate"
        style={{ padding: "4px" }}
        size={["xl", "l"].includes(screenSize) ? "l" : screenSize === "m" ? "m" : "s"}
      >
        <Grid templateColumns={{ xs: "3fr 1fr", m: "3fr 2fr" }}>
          <div style={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
            <PersonItem
              uuIdentity={uuIdentity}
              size={["xl", "l"].includes(screenSize) ? "l" : screenSize === "m" ? "m" : "s"}
            />
            {identity.uuIdentity === uuIdentity && (
              <Text category="interface" segment="content" type="small">
                <Lsi lsi={{ en: "(You)", cs: "(Vy)" }} />
              </Text>
            )}
          </div>
          <ActionGroup
            alignment="right"
            itemList={itemList}
            collapsedMenuProps={{
              colorScheme: "neutral",
              significance: "subdued",
            }}
          />
        </Grid>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { MemberItem };
export default MemberItem;
//@@viewOff:exports
