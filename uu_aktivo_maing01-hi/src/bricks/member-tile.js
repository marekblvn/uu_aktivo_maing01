//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize, useSession } from "uu5g05";
import Config from "./config/config.js";
import { ActionGroup, Box, Grid, RichIcon, Text } from "uu5g05-elements";
import { PersonItem, PersonPhoto, usePersonPhoto } from "uu_plus4u5g02-elements";
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

const MemberTile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "MemberTile",
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

  render({ uuIdentity, onRemoveMember, onPromoteAdmin, onDemoteAdmin, onLeaveActivity, onUpdateEmail }) {
    //@@viewOn:private
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
    };

    const promoteAdminAction = {
      icon: "mdi-star-plus",
      children: <Lsi lsi={{ en: "Promote to administrator", cs: "Povýšit na správce" }} />,
      onClick: () => onPromoteAdmin(uuIdentity),
      order: -1,
      tooltip: { en: "Promote to administrator", cs: "Povýšit na správce" },
      collapsed: "always",
    };

    const demoteAdminAction = {
      icon: "mdi-star-minus",
      children: <Lsi lsi={{ en: "Demote administrator", cs: "Odebrat správcovství" }} />,
      onClick: () => onDemoteAdmin(uuIdentity),
      order: 0,
      tooltip: { en: "Demote administrator", cs: "Odebrat správcovství" },
      collapsed: "always",
      colorScheme: "neutral",
    };

    const removeMemberAction = {
      icon: "mdi-account-remove",
      children: <Lsi lsi={{ en: "Remove member", cs: "Odebrat člena" }} />,
      onClick: () => onRemoveMember(uuIdentity),
      order: 1,
      tooltip: { en: "Remove member", cs: "Odebrat člena" },
      collapsed: "always",
      colorScheme: "negative",
    };

    const updateEmailAction = {
      icon: "mdi-at",
      children: <Lsi lsi={{ en: "Update email", cs: "Změnit email" }} />,
      onClick: onUpdateEmail,
      tooltip: { en: "Update email", cs: "Změnit email" },
      collapsed: "always",
      colorScheme: "neutral",
    };

    const itemList = (() => {
      const items = [];
      if (uuIdentity === identity.uuIdentity) {
        items.push(updateEmailAction);
        if (!isOwner) {
          items.push(leaveActivityAction);
          return items;
        }
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
      <Box shape="ground" borderRadius="moderate" style={{ padding: "8px", margin: "8px" }}>
        <Grid templateRows={{ xs: "100%" }} templateColumns={{ xs: "auto 36px" }}>
          <PersonItem
            uuIdentity={uuIdentity}
            title={uuIdentity === identity.uuIdentity ? <Lsi lsi={{ en: "You", cs: "Vy" }} /> : null}
            subtitle={isAuthority || isExecutive ? uuIdentity : null}
          />
          <ActionGroup itemList={itemList} />
        </Grid>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { MemberTile };
export default MemberTile;
//@@viewOff:exports
