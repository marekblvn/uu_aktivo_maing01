//@@viewOn:imports
import { createVisualComponent, Lsi, useLsi, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import { Error, Unauthorized, useAlertBus } from "uu_plus4u5g02-elements";
import importLsi from "../lsi/import-lsi.js";
import Container from "../bricks/container.js";
import { Dialog, Pending } from "uu5g05-elements";
import InvitationListProvider from "../providers/invitation-list-provider.js";
import InvitationTable from "../bricks/invitation-table.js";
import { withRoute } from "uu_plus4u5g02-app";
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

let InvitationManagement = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "InvitationManagement",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { isAuthority, isExecutive } = useAuthorization();
    const [screenSize] = useScreenSize();
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });

    const [dialogProps, setDialogProps] = useState(null);
    //@@viewOff:private

    //@@viewOn:render
    if (!isAuthority && !isExecutive) {
      return (
        <Unauthorized
          title={{
            en: "You don't have the necessary permissions to see this page",
            cs: "Nemáte dostatečná oprávnění pro zobrazení této stránky",
          }}
          subtitle={{ en: "Super secret stuff is going on here.", cs: "Dějí se zde super tajné věci." }}
        />
      );
    }

    function renderLoading() {
      return <Pending size="max" colorScheme="primary" />;
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          const errorCode = errorData.error?.code;
          return (
            <Error
              title={errorLsi[errorCode]?.header || { en: "Something went wrong", cs: "Něco se pokazilo" }}
              subtitle={errorLsi[errorCode]?.message || errorData.error?.code}
              error={errorData.error}
            />
          );
      }
    }

    function renderReady(data, handlerMap) {
      if (!data || !data.length) return null;

      const handleDeleteInvitation = (invitation) => {
        const deleteInvitation = async () => {
          try {
            await invitation.handlerMap.delete({ id: invitation.id });
            setDialogProps(null);
            addAlert({
              priority: "info",
              header: { en: "Invitation deleted", cs: "Pozvánka smazána" },
              message: {
                en: `Invitation to ${invitation.activityName} was successfully deleted.`,
                cs: `Pozvánka do ${invitation.activityName} byla úspěšně smazána.`,
              },
              durationMs: 2000,
            });
          } catch (error) {
            showError(error);
          }
        };

        setDialogProps({
          header: <Lsi import={importLsi} path={["Dialog", "deleteInvitation", "header"]} />,
          icon: "mdi-email-remove",
          info: <Lsi import={importLsi} path={["Dialog", "deleteInvitation", "info"]} />,
          actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
          actionList: [
            {
              children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
              onClick: (e) => setDialogProps(null),
            },
            {
              children: <Lsi import={importLsi} path={["Dialog", "deleteInvitation", "submit"]} />,
              onClick: deleteInvitation,
              colorScheme: "negative",
            },
          ],
        });
      };

      const handleRefresh = async () => {
        return await handlerMap.load();
      };

      return (
        <InvitationTable
          data={data}
          onRefresh={handleRefresh}
          onDeleteInvitation={handleDeleteInvitation}
          onLoadNext={handlerMap.loadNext}
        />
      );
    }

    return (
      <Container
        style={{
          height: "calc(100vh-88px)",
          marginTop: "12px",
          maxWidth: "auto",
        }}
      >
        <InvitationListProvider pageSize={100}>
          {({ state, data, errorData, pendingData, handlerMap }) => {
            switch (state) {
              case "pendingNoData":
                return renderLoading();
              case "errorNoData":
                return renderError(errorData);
              case "ready":
              case "error":
              case "pending":
              case "readyNoData":
                const dataToRender = data
                  ? data.filter((item) => item != null).map((item) => ({ ...item.data, handlerMap: item.handlerMap }))
                  : [];
                return renderReady(dataToRender, handlerMap);
            }
          }}
        </InvitationListProvider>
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
      </Container>
    );
    //@@viewOff:render
  },
});

InvitationManagement = withRoute(InvitationManagement, { authenticated: true });

//@@viewOn:exports
export { InvitationManagement };
export default InvitationManagement;
//@@viewOff:exports
