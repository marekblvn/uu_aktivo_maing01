//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useLsi, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import Container from "./container.js";
import { Dialog, Grid, useAlertBus } from "uu5g05-elements";
import MemberList from "./member-list.js";
import importLsi from "../lsi/import-lsi.js";
import { useAlertBus, PersonItem } from "uu_plus4u5g02-elements";
//@@viewOff:imports

//@@viewOn:constants
const DIALOG_ICONS = {
  addAdministrator: "mdi-star-plus",
  removeAdministrator: "mdi-star-minus",
  removeMember: "mdi-account-remove",
  leave: "mdi-exit-run",
};
const DIALOG_COLOR = {
  addAdministrator: "primary",
  removeAdministrator: "negative",
  removeMember: "negative",
  leave: "negative",
};
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: (props) => Config.Css.css({}),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const ActivityMembersView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityMembersView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ members, owner, administrators, onRemoveMember, onPromoteAdmin, onDemoteAdmin, onLeaveActivity }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { addAlert } = useAlertBus();
    const [dialogProps, setDialogProps] = useState();
    const membersFiltered = members.filter((item) => !administrators.includes(item) && item !== owner);
    //@@viewOff:private

    const handleCloseDialog = () => setDialogProps(null);
    const handleOpenDialog = useCallback((cmdCode, uuIdentity = "", onConfirm) => {
      setDialogProps({
        header: <Lsi import={importLsi} path={["Dialog", cmdCode, "header"]} />,
        info: <Lsi import={importLsi} path={["Dialog", cmdCode, "info"]} />,
        icon: DIALOG_ICONS[cmdCode],
        children: uuIdentity.length ? (
          <div style={{ padding: "8px" }}>
            <PersonItem uuIdentity={uuIdentity} />
          </div>
        ) : null,
        actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
        actionList: [
          {
            children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
            onClick: handleCloseDialog,
          },
          {
            children: <Lsi import={importLsi} path={["Dialog", cmdCode, "submit"]} />,
            colorScheme: DIALOG_COLOR[cmdCode],
            onClick: onConfirm,
          },
        ],
      });
    }, []);

    const handlePromoteAdmin = (uuIdentity) => {
      handleOpenDialog("addAdministrator", uuIdentity, async () => {
        try {
          await onPromoteAdmin(uuIdentity);
        } catch (error) {
          addAlert({
            priority: "error",
            header: {
              en: "Error occurred while promoting user to administrator",
              cs: "Při udělování správcovství nastala chyba",
            },
            message: error.message,
            durationMs: 3000,
          });
        }
      });
    };

    const handleDemoteAdmin = (uuIdentity) => {
      handleOpenDialog("removeAdministrator", uuIdentity, async () => {
        try {
          await onDemoteAdmin(uuIdentity);
        } catch (error) {
          addAlert({
            priority: "error",
            header: {
              en: "Error occurred while demoting administrator",
              cs: "Při odebírání správcovství nastala chyba",
            },
            message: error.message,
            durationMs: 3000,
          });
        }
      });
    };

    const handleRemoveMember = (uuIdentity) => {
      handleOpenDialog("removeMember", uuIdentity, async () => {
        try {
          await onRemoveMember(uuIdentity);
        } catch (error) {
          addAlert({
            priority: "error",
            header: {
              en: "Error occurred while trying to remove member",
              cs: "Při odebírání člena z aktivity nastala chyba",
            },
            message: error.message,
            durationMs: 3000,
          });
        }
      });
    };

    const handleLeaveActivity = () => {
      handleOpenDialog("leave", "", async () => {
        try {
          await onLeaveActivity();
        } catch (error) {
          addAlert({
            priority: "error",
            header: {
              en: "Error occurred while trying to leave activity",
              cs: "Při pokusu o opuštění aktivity nastala chyba",
            },
            message: error.message,
            durationMs: 3000,
          });
        }
      });
    };

    //@@viewOn:render

    addAlert({
      priority: "error",
      header: "Error",
      message: "err",
      error: {
        name: "erro",
        message: "error",
      },
      controlList: [
        {
          colorScheme: "negative",
          significance: "distinct",
        },
      ],
    });

    return (
      <Container
        style={{
          width: "100%",
          padding: "12px 8px 10px",
          border: "solid 1px rgb(33,33,33, 0.11)",
          borderTop: "none",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <Grid templateColumns="1fr">
          <MemberList
            items={[owner]}
            colorScheme="primary"
            lsiTitle={{ en: "Activity owner", cs: "Vlastník aktivity" }}
            icon="mdi-crown"
            iconColor="rgb(218,165,32)"
          />
          <MemberList
            items={administrators}
            colorScheme="secondary"
            lsiTitle={{ en: "Administrators", cs: "Správci" }}
            icon="mdi-star"
            iconColor="rgb(117, 145, 170)"
            collapsible={true}
            onRemoveMember={handleRemoveMember}
            onPromoteAdmin={() => {}}
            onDemoteAdmin={handleDemoteAdmin}
            onLeaveActivity={handleLeaveActivity}
          />
          <MemberList
            items={membersFiltered}
            colorScheme="neutral"
            lsiTitle={{ en: "Members", cs: " Členové" }}
            icon="mdi-account"
            iconColor="rgb(128,128,128)"
            collapsible={true}
            onRemoveMember={handleRemoveMember}
            onPromoteAdmin={handlePromoteAdmin}
            onDemoteAdmin={() => {}}
            onLeaveActivity={handleLeaveActivity}
          />
        </Grid>
        <Dialog {...dialogProps} open={!!dialogProps} onClose={handleCloseDialog} />
      </Container>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityMembersView };
export default ActivityMembersView;
//@@viewOff:exports
