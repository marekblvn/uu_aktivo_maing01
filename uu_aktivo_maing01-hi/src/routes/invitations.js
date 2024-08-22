//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useLsi, useRef, useScreenSize, useSession, useState } from "uu5g05";
import Config from "./config/config.js";
import { Error, withRoute } from "uu_plus4u5g02-app";
import Container from "../bricks/container.js";
import { Dialog, Header, Pending, PlaceholderBox, RichIcon } from "uu5g05-elements";
import InvitationListProvider from "../providers/invitation-list-provider.js";
import InvitationList from "../bricks/invitation-list.js";
import importLsi from "../lsi/import-lsi.js";
import { useAlertBus } from "uu_plus4u5g02-elements";
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
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const loadRef = useRef();
    const [dialogProps, setDialogProps] = useState();
    const placeholderLsi = useLsi({ import: importLsi, path: ["Placeholder", "noInvitations"] });
    //@@viewOff:private

    const showDeleteDialog = useCallback((invitation = {}, onConfirm) => {
      setDialogProps({
        header: (
          <Lsi import={importLsi} path={["Dialog", "declineInvitation", "header"]} params={[invitation.activityName]} />
        ),
        info: <Lsi import={importLsi} path={["Dialog", "declineInvitation", "info"]} />,
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
            children: <Lsi import={importLsi} path={["Dialog", "declineInvitation", "submit"]} />,
            onClick: async (e) => {
              e.preventDefault();
              try {
                await onConfirm();
                setDialogProps(null);
                await loadRef.current({ filters: { uuIdentity: identity.uuIdentity } });
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
                showError(error);
                return;
              }
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
                showError(error);
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
          <div>
            <PlaceholderBox
              code="items"
              header={placeholderLsi.header}
              info={placeholderLsi.info}
              style={{ marginTop: "10%", padding: "0 16px" }}
            />
          </div>
        );
      }
      const dataToRender = data.filter(item != null);
      return (
        <InvitationList
          itemList={dataToRender}
          onInvitationDelete={handleDeleteInvitation}
          onInvitationAccept={handleAcceptInvitation}
        />
      );
    }

    //@@viewOn:render

    return (
      <Container
        style={{
          width: `${["xs", "s"].includes(screenSize) ? "100%" : "90%"}`,
          marginTop: "32px",
          height: "calc(100vh - 88px)",
        }}
      >
        <div style={{ display: "flex", marginBottom: "24px", padding: "0 8px" }}>
          <Header
            title={<Lsi lsi={{ en: "Invitations", cs: "Pozvánky" }} />}
            icon={
              <RichIcon
                icon="uugds-email"
                colorScheme="steel"
                significance="subdued"
                borderRadius="moderate"
                cssBackground="#ffffff"
                size={screenSize === "xs" ? "l" : "xl"}
              />
            }
            level={["xs", "s"].includes(screenSize) ? 5 : 4}
          />
        </div>
        <InvitationListProvider>
          {({ state, data, errorData, pendingData, handlerMap }) => {
            loadRef.current = handlerMap.load;
            switch (state) {
              case "pending":
                return renderReady(data);
              case "pendingData":
                return renderLoading();
              case "error":
                return renderReady(data);
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
