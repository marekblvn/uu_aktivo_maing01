//@@viewOn:imports
import { createVisualComponent, Lsi, useCall, useCallback, useScreenSize, useState } from "uu5g05";
import { useAlertBus, PersonItem } from "uu_plus4u5g02-elements";
import { Button, Dialog, Grid } from "uu5g05-elements";
import { useAuthorization } from "../contexts/authorization-context.js";
import { useActivityAuthorization } from "../contexts/activity-authorization-context.js";
import Calls from "../calls.js";
import Config from "./config/config.js";
import Container from "./container.js";
import MemberList from "./member-list.js";
import CreateInvitationForm from "./create-invitation-modal.js";
import importLsi from "../lsi/import-lsi.js";
import { CancelButton, SubmitButton } from "uu5g05-forms";
import FormModal from "./form-modal.js";
//@@viewOff:imports

//@@viewOn:constants
const DIALOG_ICONS = {
  addAdministrator: "mdi-star-plus",
  removeAdministrator: "mdi-star-minus",
  removeMember: "mdi-account-remove",
  leaveActivity: "mdi-exit-run",
};
const DIALOG_COLOR = {
  addAdministrator: "primary",
  removeAdministrator: "negative",
  removeMember: "negative",
  leaveActivity: "negative",
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

  render({
    id: activityId,
    name,
    members,
    owner,
    administrators,
    onRemoveMember,
    onPromoteAdmin,
    onDemoteAdmin,
    onLeaveActivity,
  }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { addAlert, showError } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const { call: callInvitationCreate } = useCall(Calls.Invitation.create);
    const { isAuthority, isExecutive } = useAuthorization();
    const { isOwner, isAdministrator } = useActivityAuthorization();
    const [dialogProps, setDialogProps] = useState(null);
    const [modalProps, setModalProps] = useState(null);
    const membersFiltered = members.filter((item) => !administrators.includes(item) && item !== owner);
    //@@viewOff:private

    const showDialog = useCallback(
      (cmdCode, onConfirm, uuIdentity = "") => {
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
              onClick: () => setDialogProps(null),
            },
            {
              children: <Lsi import={importLsi} path={["Dialog", cmdCode, "confirm"]} />,
              colorScheme: DIALOG_COLOR[cmdCode],
              onClick: onConfirm,
            },
          ],
        });
      },
      [setDialogProps],
    );

    const showInvitationCreateModal = useCallback(
      (onSubmit) => {
        setModalProps({
          open: true,
          onClose: () => setModalProps(null),
          onSubmit: onSubmit,
          header: <Lsi lsi={{ en: "Invite user to activity", cs: "Pozvat uživatele do aktivity" }} />,
          footer: (
            <Grid templateColumns={{ xs: "repeat(2,1fr)", s: "repeat(2,auto)" }} justifyContent={{ s: "end" }}>
              <CancelButton onClick={() => setModalProps(null)} />
              <SubmitButton>
                <Lsi lsi={{ en: "Invite", cs: "Pozvat" }} />
              </SubmitButton>
            </Grid>
          ),
          children: ({ style }) => <CreateInvitationForm style={style} members={members} />,
        });
      },
      [setModalProps],
    );

    const handleOpenCreateInvitationModal = () =>
      showInvitationCreateModal(async (e) => {
        e.preventDefault();
        const uuIdentity = e.data.value.uuIdentity;
        try {
          await callInvitationCreate({ activityId, uuIdentity });
          setModalProps(null);
          addAlert({
            priority: "info",
            header: {
              en: "User invited",
              cs: "Uživatel pozván",
            },
            message: {
              en: "Invitation was successfully created.",
              cs: "Byla úspěšně vytvořena pozvánka pro uživatele.",
            },
            durationMs: 2000,
          });
        } catch (error) {
          showError(error);
        }
      });

    const handlePromoteAdmin = (uuIdentity) => {
      showDialog("addAdministrator", async (e) => {
        e.preventDefault();
        try {
          await onPromoteAdmin(uuIdentity);
          setDialogProps(null);
          addAlert({
            priority: "info",
            header: { en: "New activity administrator added", cs: "Přidán nový správce aktivity" },
            message: {
              en: "You have successfully promoted member to administrator.",
              cs: "Úspěšně jste povýšili člena na správce.",
            },
            durationMs: 2000,
          });
        } catch (error) {
          showError(error);
        }
      });
    };

    const handleDemoteAdmin = (uuIdentity) => {
      showDialog("removeAdministrator", async (e) => {
        e.preventDefault();
        try {
          await onDemoteAdmin(uuIdentity);
          setDialogProps(null);
          addAlert({
            priority: "info",
            header: { en: "Activity administrator removed", cs: "Odebrán správce aktivity" },
            message: {
              en: "You have successfully revoked member's administrator status.",
              cs: "Úspěšně jste členovi odebrali správcovství.",
            },
            durationMs: 2000,
          });
        } catch (error) {
          showError(error);
        }
      });
    };

    const handleRemoveMember = (uuIdentity) => {
      showDialog("removeMember", async (e) => {
        e.preventDefault();
        try {
          await onRemoveMember(uuIdentity);
          setDialogProps(null);
          addAlert({
            priority: "info",
            header: { en: "Activity member removed", cs: "Člen aktivity odebrán" },
            message: {
              en: "You have successfully removed a member from the activity.",
              cs: "Úspěšně jste odebrali člena z aktivity.",
            },
            durationMs: 2000,
          });
        } catch (error) {
          showError(error);
        }
      });
    };

    const handleLeaveActivity = () => {
      showDialog("leaveActivity", async (e) => {
        e.preventDefault();
        try {
          await onLeaveActivity();
          setDialogProps(null);
          addAlert({
            priority: "info",
            header: { en: `You have left the activity '${name}'`, cs: `Opustil(a) jste aktivitu '${name}'` },
            message: { en: "You are no longer a member of the activity.", cs: "Nejste již členem této aktivity." },
            durationMs: 2000,
          });
        } catch (error) {
          showError(error);
        }
      });
    };

    //@@viewOn:render

    return (
      <Container
        style={{
          width: "100%",
          padding: "12px 8px 10px",
          border: "solid 1px rgb(33,33,33, 0.11)",
          borderTop: "none",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          height: "100%",
        }}
      >
        <Grid templateColumns="1fr">
          {(isOwner || isAdministrator || isAuthority || isExecutive) && (
            <Button
              style={{ marginLeft: "auto" }}
              icon="mdi-account-plus"
              colorScheme="primary"
              size={["xl", "l", "m"].includes(screenSize) ? "m" : "s"}
              onClick={handleOpenCreateInvitationModal}
              tooltip={{ en: "Invite user to activity", cs: "Pozvat uživatele do aktivity" }}
            />
          )}
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
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
        <FormModal {...modalProps} open={!!modalProps} onClose={() => setModalProps(null)} />
      </Container>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityMembersView };
export default ActivityMembersView;
//@@viewOff:exports
