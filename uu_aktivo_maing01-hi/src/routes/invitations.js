//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useRef, useScreenSize, useSession, useState } from "uu5g05";
import Config from "./config/config.js";
import { Error, withRoute } from "uu_plus4u5g02-app";
import Container from "../bricks/container.js";
import { Dialog, Header, Pending, PlaceholderBox, RichIcon, useAlertBus } from "uu5g05-elements";
import InvitationListProvider from "../providers/invitation-list-provider.js";
import InvitationList from "../bricks/invitation-list.js";
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

let Invitations = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Invitations",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { identity } = useSession();
    const { addAlert } = useAlertBus();
    const loadRef = useRef();
    const [dialogProps, setDialogProps] = useState();
    //@@viewOff:private

    const showDeleteDialog = useCallback((invitation = {}, onConfirm) => {
      setDialogProps({
        header: (
          <Lsi
            lsi={{
              en: `Are you sure you want to decline invitation to ${invitation.activityName || "Activity name"}?`,
              cs: `Opravdu chcete odmítnout pozvánku do ${invitation.activityName || "Activity name"}?`,
            }}
          />
        ),
        info: (
          <Lsi lsi={{ en: "This invitation will be deleted permanently.", cs: "Tato pozvánka bude trvale smazána." }} />
        ),
        icon: "mdi-email-remove",
        actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
        actionList: [
          {
            children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
            onClick: (e) => {
              e.preventDefault();
              setDialogProps(null);
            },
          },
          {
            children: <Lsi lsi={{ en: "Decline", cs: "Odmítnout" }} />,
            onClick: async (e) => {
              e.preventDefault();
              try {
                await onConfirm();
                addAlert({
                  header: { en: "Invitation denied", cs: "Pozvánka odmítnuta" },
                  message: {
                    en: `Invitation to ${invitation.activityName} was denied.`,
                    cs: `Pozvánka do ${invitation.activityName} byla odmítnuta.`,
                  },
                  priority: "info",
                  durationMs: 2_000,
                });
              } catch (error) {
                addAlert({ header: "Error!", message: error.message, priority: "error" });
                return;
              }
              setDialogProps(null);
              await loadRef.current({ filters: { uuIdentity: identity.uuIdentity } });
            },
            colorScheme: "negative",
            significance: "highlighted",
          },
        ],
      });
    });

    const showAcceptDialog = useCallback((invitation = {}, onConfirm) => {
      setDialogProps({
        header: (
          <Lsi
            lsi={{
              cs: `Chystáte se přijmout pozvánku do ${invitation.activityName}.`,
              en: `You are about to accept an invitation to ${invitation.activityName}.`,
            }}
          />
        ),
        info: (
          <Lsi
            lsi={{
              cs: "Přijmutím pozvánky se stanete členem aktivity.",
              en: "By accepting the invitation you become a member of the activity.",
            }}
          />
        ),
        icon: "mdi-email-check",
        actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
        actionList: [
          {
            children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
            onClick: (e) => {
              e.preventDefault();
              setDialogProps(null);
            },
          },
          {
            children: <Lsi lsi={{ en: "Accept", cs: "Přijmout" }} />,
            colorScheme: "positive",
            significance: "highlighted",
            onClick: async (e) => {
              e.preventDefault();
              try {
                await onConfirm();
                addAlert({
                  header: { en: "Invitation accepted", cs: "Pozvánka přijata" },
                  message: {
                    en: `Invitation to ${invitation.activityName} was accepted. You are now a member of this activity.`,
                    cs: `Pozvánka do ${invitation.activityName} byla odmítnuta. Nyní jste členem této aktivity.`,
                  },
                  priority: "success",
                  durationMs: 3_000,
                });
              } catch (error) {
                addAlert({ header: "Error!", message: error.message, priority: "error" });
                return;
              }
              setDialogProps(null);
              await loadRef.current({ filters: { uuIdentity: identity.uuIdentity } });
            },
          },
        ],
      });
    });

    const handleDeleteInvitation = useCallback((item) => {
      showDeleteDialog(item.data, async () => {
        return await item.handlerMap.delete(item.data.id);
      });
    });

    const handleAcceptInvitation = useCallback((item) => {
      showAcceptDialog(item.data, async () => {
        return await item.handlerMap.accept(item.data.id);
      });
    });

    function renderLoading() {
      return <Pending size="max" colorScheme="primary" />;
    }

    function renderError(errorData) {
      return (
        <Error
          title={errorData.error?.message}
          subtitle={"/" + errorData.error?.code.split("/").at(-1)}
          error={errorData.error}
        />
      );
    }

    function renderReady(data) {
      if (!data.length) {
        return (
          <PlaceholderBox
            code="items"
            header={{ en: "You don't have any invitations at the moment", cs: "Momentálně nemáte žádné pozvánky" }}
            info={{
              en: "Once you are invited to an activity, the invitation will be shown here.",
              cs: "Jakmile budete pozván do nějaké aktivity, najdete zde pozvánku.",
            }}
            style={{ marginTop: "10%" }}
          />
        );
      }
      return (
        <InvitationList
          itemList={data}
          onInvitationDelete={handleDeleteInvitation}
          onInvitationAccept={handleAcceptInvitation}
        />
      );
    }

    //@@viewOn:render

    return (
      <Container style={{ width: `${["xs", "s"].includes(screenSize) ? "100%" : "90%"}`, marginTop: "32px" }}>
        <Header
          title={<Lsi lsi={{ en: "Invitations", cs: "Pozvánky" }} />}
          icon={
            <RichIcon
              icon="mdi-email"
              colorScheme="steel"
              significance="subdued"
              borderRadius="moderate"
              cssBackground="#ffffff"
              size={screenSize === "xs" ? "l" : "xl"}
            />
          }
          level={4}
          style={{ marginLeft: `${["xs", "s"].includes(screenSize) ? "6px" : "0"}`, marginBottom: "24px" }}
        />
        <InvitationListProvider>
          {({ state, data, errorData, pendingData, handlerMap }) => {
            loadRef.current = handlerMap.load;
            switch (state) {
              case "pending":
              case "pendingData":
                return renderLoading();
              case "error":
              case "errorNoData":
                return renderError(errorData);
              case "ready":
              case "readyNoData":
                return renderReady(data);
            }
          }}
        </InvitationListProvider>
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
      </Container>
    );
    //@@viewOff:render
  },
});

Invitations = withRoute(Invitations, { authenticated: true });

//@@viewOn:exports
export { Invitations };
export default Invitations;
//@@viewOff:exports
