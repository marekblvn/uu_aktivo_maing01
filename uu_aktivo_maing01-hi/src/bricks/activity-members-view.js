//@@viewOn:imports
import {
  AutoLoad,
  createVisualComponent,
  Fragment,
  Lsi,
  useCall,
  useCallback,
  useLsi,
  useScreenSize,
  useState,
} from "uu5g05";
import { useAlertBus, PersonItem, Error } from "uu_plus4u5g02-elements";
import {
  ActionGroup,
  Box,
  DateTime,
  Dialog,
  Grid,
  Icon,
  Line,
  LinkPanel,
  Pending,
  PlaceholderBox,
  Text,
} from "uu5g05-elements";
import { useAuthorization } from "../contexts/authorization-context.js";
import { useActivityAuthorization } from "../contexts/activity-authorization-context.js";
import Calls from "../calls.js";
import Config from "./config/config.js";
import Container from "./container.js";
import MemberList from "./member-list.js";
import CreateInvitationForm from "./create-invitation-form.js";
import InvitationListProvider from "../providers/invitation-list-provider.js";
import importLsi from "../lsi/import-lsi.js";
import { CancelButton, SubmitButton } from "uu5g05-forms";
import FormModal from "./form-modal.js";
import { List, Table } from "uu5tilesg02-elements";
//@@viewOff:imports

//@@viewOn:constants
const DIALOG_ICONS = {
  addAdministrator: "mdi-star-plus",
  removeAdministrator: "mdi-star-minus",
  removeMember: "mdi-account-remove",
  leaveActivity: "mdi-exit-run",
  deleteInvitation: "mdi-email-remove-outline",
};
const DIALOG_COLOR = {
  addAdministrator: "primary",
  removeAdministrator: "negative",
  removeMember: "negative",
  leaveActivity: "negative",
  deleteInvitation: "negative",
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
    const { call: callInvitationCreate } = useCall(Calls.Invitation.create);
    const { addAlert, showError } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const { isAuthority, isExecutive } = useAuthorization();
    const { isOwner, isAdministrator } = useActivityAuthorization();
    const [dialogProps, setDialogProps] = useState(null);
    const [modalProps, setModalProps] = useState(null);
    const [openInvitations, setOpenInvitations] = useState(false);
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
          children: <CreateInvitationForm members={members} />,
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
    function renderLoading() {
      return <Pending size="xl" colorScheme="primary" />;
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
          const errorCode = errorData.error?.code;
          return (
            <Error title={errorLsi[errorCode]?.header} subtitle={errorLsi[errorCode]?.info} error={errorData.error} />
          );
      }
    }

    function renderReady(data, handlerMap) {
      const handleDeleteInvitation = (item) =>
        showDialog("deleteInvitation", async (e) => {
          e.preventDefault();
          try {
            await item.handlerMap.delete({ id: item.id });
            setDialogProps(null);
            addAlert({
              priority: "info",
              header: { en: "Invitation deleted", cs: "Pozvánka smazána" },
              message: { en: "You successfully deleted an invitation.", cs: "Úspěšně jste smazali pozvánku." },
            });
          } catch (error) {
            showError(error);
          }
        });

      const getActionList = ({ rowIndex, data }) => {
        return [
          {
            icon: "mdi-email-remove-outline",
            tooltip: { en: "Delete invitation", cs: "Smazat pozvánku" },
            onClick: () => handleDeleteInvitation(data),
          },
        ];
      };

      const dataToRender = data.map((item) => ({ ...item.data, handlerMap: item.handlerMap }));

      return (
        <Fragment>
          <ActionGroup
            itemList={[
              {
                icon: "uugds-refresh",
                onClick: () => handlerMap.load(),
              },
            ]}
            size="s"
            style={{ margin: "-12px 0 4px" }}
          />
          <List
            data={dataToRender}
            verticalAlignment="center"
            getActionList={getActionList}
            emptyState={
              <PlaceholderBox
                code="items"
                header={{ en: "No invitations to display", cs: "Žádné pozvánky k zobrazení" }}
                info={{
                  en: "There are no active invitations to this activity.",
                  cs: "Neexistují žádné aktivní pozvánky do této aktivity.",
                }}
              />
            }
            columnList={[
              {
                value: "uuIdentity",
                header: <Lsi lsi={{ en: "User", cs: "Uživatel" }} />,
                cell: ({ data }) => (
                  <PersonItem
                    uuIdentity={data.uuIdentity}
                    subtitle={isAuthority || isExecutive ? data.uuIdentity : null}
                  />
                ),
              },
              {
                value: "createdAt",
                header: <Lsi lsi={{ en: "Invitation created", cs: "Pozván" }} />,
                cell: ({ data }) => <DateTime value={data.createdAt} timeFormat="short" />,
              },
            ]}
          >
            {({ data }) => {
              return (
                <Box borderRadius="moderate" style={{ padding: "8px", display: "flex" }}>
                  <PersonItem
                    uuIdentity={data.uuIdentity}
                    subtitle={<DateTime value={data.createdAt} />}
                    direction="vertical"
                  />
                  <ActionGroup
                    itemList={[
                      {
                        icon: "mdi-email-remove-outline",
                        onClick: () => handleDeleteInvitation(data),
                      },
                    ]}
                  />
                </Box>
              );
            }}
          </List>
          <AutoLoad data={data} handleLoadNext={handlerMap.loadNext} distance={window.innerHeight} />
        </Fragment>
      );
    }

    return (
      <Container
        style={{
          width: "100%",
          padding: "12px 16px 24px",
          border: "solid 1px rgb(33,33,33, 0.11)",
          borderTop: "none",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          height: "100%",
        }}
      >
        {(isOwner || isAdministrator || isAuthority || isExecutive) && (
          <ActionGroup
            itemList={[
              {
                icon: "mdi-account-plus",
                children: ["xs", "s"].includes(screenSize) ? null : (
                  <Lsi lsi={{ en: "Invite user", cs: "Pozvat uživatele" }} />
                ),
                tooltip: { en: "Invite user to activity", cs: "Pozvat uživatele do aktivity" },
                onClick: handleOpenCreateInvitationModal,
              },
            ]}
          />
        )}
        <MemberList
          owner={owner}
          administrators={administrators}
          members={membersFiltered}
          onPromoteAdmin={handlePromoteAdmin}
          onDemoteAdmin={handleDemoteAdmin}
          onRemoveMember={handleRemoveMember}
          onLeaveActivity={handleLeaveActivity}
        />
        {(isAdministrator || isOwner || isAuthority || isExecutive) && (
          <Fragment>
            <Line colorScheme="neutral" significance="subdued" margin="16px 0" />
            <LinkPanel
              open={openInvitations}
              onChange={(e) => setOpenInvitations(e.data.open)}
              header={
                <Text category="interface" segment="highlight" type="common" autoFit>
                  <Icon icon={"mdi-card-account-mail-outline"} colorScheme={"neutral"} margin={{ right: "4px" }} />
                  <Lsi lsi={{ en: "Invited users", cs: "Pozvaní uživatelé" }} />
                </Text>
              }
            >
              <InvitationListProvider filters={{ activityId: activityId }} pageSize={10}>
                {({ state, data, pendingData, errorData, handlerMap }) => {
                  switch (state) {
                    case "pendingNoData":
                      return renderLoading();
                    case "error":
                    case "errorNoData":
                      return renderError(errorData);
                    case "pending":
                    case "ready":
                    case "readyNoData":
                      return renderReady(data, handlerMap);
                  }
                }}
              </InvitationListProvider>
            </LinkPanel>
          </Fragment>
        )}
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
        <FormModal {...modalProps} />
      </Container>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityMembersView };
export default ActivityMembersView;
//@@viewOff:exports
