//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useLsi, useScreenSize, useSession, useState } from "uu5g05";
import Config from "./config/config.js";
import { Error, withRoute } from "uu_plus4u5g02-app";
import Container from "../bricks/container.js";
import { Dialog, Grid, Header, Pending, PlaceholderBox, RichIcon } from "uu5g05-elements";
import { SubmitButton } from "uu5g05-forms";
import InvitationListProvider from "../providers/invitation-list-provider.js";
import InvitationList from "../bricks/invitation-list.js";
import importLsi from "../lsi/import-lsi.js";
import { useAlertBus } from "uu_plus4u5g02-elements";
import UpdateEmailForm from "../bricks/update-email-form.js";
import FormModal from "../bricks/form-modal.js";
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

const _Invitations = createVisualComponent({
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
    const [dialogProps, setDialogProps] = useState(null);
    const [modalProps, setModalProps] = useState(null);
    const placeholderLsi = useLsi({ import: importLsi, path: ["Placeholder", "noInvitations"] });
    //@@viewOff:private

    const showDeleteDialog = useCallback(
      (invitation = {}, onConfirm) => {
        setDialogProps({
          header: (
            <Lsi
              import={importLsi}
              path={["Dialog", "declineInvitation", "header"]}
              params={[invitation.activityName]}
            />
          ),
          info: <Lsi import={importLsi} path={["Dialog", "declineInvitation", "info"]} />,
          icon: "mdi-email-remove",
          actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
          actionList: [
            {
              children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
              onClick: () => setDialogProps(null),
            },
            {
              children: <Lsi import={importLsi} path={["Dialog", "declineInvitation", "confirm"]} />,
              onClick: onConfirm,
              colorScheme: "negative",
              significance: "highlighted",
            },
          ],
        });
      },
      [setDialogProps],
    );

    const showAcceptDialog = useCallback(
      (invitation = {}, onConfirm) => {
        setDialogProps({
          header: (
            <Lsi
              import={importLsi}
              path={["Dialog", "acceptInvitation", "header"]}
              params={[invitation.activityName]}
            />
          ),
          info: <Lsi import={importLsi} path={["Dialog", "acceptInvitation", "info"]} />,
          icon: "mdi-email-check",
          actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
          actionList: [
            {
              children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
              onClick: () => setDialogProps(null),
            },
            {
              children: <Lsi import={importLsi} path={["Dialog", "acceptInvitation", "confirm"]} />,
              colorScheme: "positive",
              significance: "highlighted",
              onClick: () => showUpdatEmailDialog(onConfirm),
            },
          ],
        });
      },
      [setDialogProps],
    );

    const showUpdatEmailDialog = useCallback((onSubmit) => {
      setModalProps({
        open: true,
        onClose: () => setModalProps(null),
        onSubmit: onSubmit,
        header: (
          <Lsi lsi={{ en: "Set email for receiving notifications", cs: "Nastavte e-mail pro zasílání upozornění" }} />
        ),
        footer: (
          <Grid>
            <SubmitButton>
              <Lsi lsi={{ en: "Confirm", cs: "Potvrdit" }} />
            </SubmitButton>
          </Grid>
        ),
        children: <UpdateEmailForm />,
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
      if (!data || !data.length) {
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

      const handleDeleteInvitation = (item) => {
        showDeleteDialog(item.data, async (e) => {
          e.preventDefault();
          try {
            await item.handlerMap.delete({ id: item.data.id });
            setDialogProps(null);
            addAlert({
              header: { en: "Invitation rejected", cs: "Pozvánka odmítnuta" },
              message: {
                en: `Invitation to ${item.data.activityName} was rejected.`,
                cs: `Pozvánka do ${item.data.activityName} byla odmítnuta.`,
              },
              priority: "info",
              durationMs: 2_000,
            });
          } catch (error) {
            showError(error);
          }
        });
      };

      const handleAcceptInvitation = (item) =>
        showAcceptDialog(item.data, async (e) => {
          e.preventDefault();
          try {
            await item.handlerMap.accept({ id: item.data.id, email: e.data.value.email });
            setDialogProps(null);
            setModalProps(null);
            addAlert({
              header: { en: "Invitation accepted", cs: "Pozvánka přijata" },
              message: {
                en: `Invitation to ${item.data.activityName} was accepted. You are now a member of this activity.`,
                cs: `Pozvánka do ${item.data.activityName} byla přijata. Nyní jste členem této aktivity.`,
              },
              priority: "success",
              durationMs: 2_000,
            });
          } catch (error) {
            showError(error);
          }
        });

      const dataToRender = data.filter((item) => item != null);
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
        <InvitationListProvider
          filters={{
            uuIdentity: identity.uuIdentity,
          }}
          pageSize={10}
        >
          {({ state, data, errorData, pendingData, handlerMap }) => {
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
        <FormModal {...modalProps} open={!!modalProps} onClose={() => setModalProps(null)} />
      </Container>
    );
    //@@viewOff:render
  },
});

const Invitations = withRoute(_Invitations, { authenticated: true });

//@@viewOn:exports
export { Invitations };
export default Invitations;
//@@viewOff:exports
