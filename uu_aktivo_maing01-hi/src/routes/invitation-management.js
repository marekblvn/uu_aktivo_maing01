//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useLsi, useScreenSize, useState } from "uu5g05";
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

const _InvitationManagement = createVisualComponent({
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
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const [screenSize] = useScreenSize();
    const [sorterList, setSorterList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [dialogProps, setDialogProps] = useState(null);
    //@@viewOff:private

    const showDeleteInvitationDialog = useCallback(
      (onConfirm) => {
        setDialogProps({
          header: <Lsi import={importLsi} path={["Dialog", "adminDeleteInvitation", "header"]} />,
          icon: "mdi-email-remove",
          info: <Lsi import={importLsi} path={["Dialog", "adminDeleteInvitation", "info"]} />,
          actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
          actionList: [
            {
              children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
              onClick: (e) => setDialogProps(null),
            },
            {
              children: <Lsi import={importLsi} path={["Dialog", "adminDeleteInvitation", "confirm"]} />,
              onClick: onConfirm,
              colorScheme: "negative",
            },
          ],
        });
      },
      [setDialogProps],
    );

    const handleDeleteInvitation = useCallback(
      (invitation) =>
        showDeleteInvitationDialog(async (e) => {
          e.preventDefault();
          try {
            await invitation.handlerMap.delete({ id: invitation.id });
            setDialogProps(null);
            addAlert({
              priority: "info",
              header: { en: "Invitation deleted", cs: "Pozvánka smazána" },
              message: { en: "The invitation was successfully deleted.", cs: "Pozvánka byla úspěšně smazána." },
              durationMs: 2000,
            });
          } catch (error) {
            showError(error);
          }
        }),
      [],
    );

    const getActionList = useCallback(({ rowIndex, data }) => {
      return [
        {
          icon: "uugds-delete",
          tooltip: { en: "Delete invitation", cs: "Smazat pozvánku" },
          onClick: () => handleDeleteInvitation(data),
          colorScheme: "negative",
        },
      ];
    }, []);

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

    function renderReady(data, pending, handlerMap) {
      const handleChangeFilterList = async (e) => {
        const filters = {};
        const sort = {};
        setFilterList(e.data.filterList);
        e.data.filterList.forEach((item) => {
          const { key, value } = item;
          filters[key] = value;
        });
        sorterList.forEach((item) => {
          const { key, ascending } = item;
          sort[key] = ascending ? 1 : -1;
        });
        await handlerMap.load({ filters, sort });
      };

      const handleChangeSorterList = async (e) => {
        const filters = {};
        const sort = {};
        setSorterList(e.data.sorterList);
        e.data.sorterList.forEach((item) => {
          const { key, ascending } = item;
          sort[key] = ascending ? 1 : -1;
        });
        filterList.forEach((item) => {
          const { key, value } = item;
          filters[key] = value;
        });
        await handlerMap.load({ filters, sort });
      };

      const handleRefresh = async () => {
        const filters = {};
        const sort = {};
        filterList.forEach((item) => {
          const { key, value } = item;
          filters[key] = value;
        });
        sorterList.forEach((item) => {
          const { key, ascending } = item;
          sort[key] = ascending ? 1 : -1;
        });
        await handlerMap.load({ filters, sort });
      };

      const handleLoadNext = async () => {
        const filters = {};
        const sort = {};
        filterList.forEach((item) => {
          const { key, value } = item;
          filters[key] = value;
        });
        sorterList.forEach((item) => {
          const { key, ascending } = item;
          sort[key] = ascending ? 1 : -1;
        });
        await handlerMap.loadNext({ filters, sort });
      };

      return (
        <InvitationTable
          data={data}
          pending={pending}
          onRefresh={handleRefresh}
          onDeleteInvitation={handleDeleteInvitation}
          onLoadNext={handleLoadNext}
          filterList={filterList}
          onFilterListChange={handleChangeFilterList}
          sorterList={sorterList}
          onSorterListChange={handleChangeSorterList}
          getActionList={getActionList}
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
              case "error":
                showError(errorData.error);
              case "pending":
              case "itemPending":
              case "ready":
              case "readyNoData":
                const pending = state === "pending" || state === "itemPending";
                return renderReady(data, pending, handlerMap);
            }
          }}
        </InvitationListProvider>
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
      </Container>
    );
    //@@viewOff:render
  },
});

const InvitationManagement = withRoute(_InvitationManagement, { authenticated: true });

//@@viewOn:exports
export { InvitationManagement };
export default InvitationManagement;
//@@viewOff:exports
