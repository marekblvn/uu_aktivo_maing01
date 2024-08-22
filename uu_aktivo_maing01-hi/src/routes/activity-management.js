//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useLsi, useRoute, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import { withRoute } from "uu_plus4u5g02-app";
import { useAuthorization } from "../contexts/authorization-context.js";
import { Error, Unauthorized, useAlertBus } from "uu_plus4u5g02-elements";
import Container from "../bricks/container.js";
import { Dialog, Pending } from "uu5g05-elements";
import ActivityListProvider from "../providers/activity-list-provider.js";
import ActivityList from "../bricks/activity-list.js";
import importLsi from "../lsi/import-lsi.js";
import DatetimeManagementModal from "../bricks/datetime-management-modal.js";
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

let ActivityManagement = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityManagement",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [, setRoute] = useRoute();
    const [screenSize] = useScreenSize();
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const { isAuthority, isExecutive } = useAuthorization();
    const [dialogProps, setDialogProps] = useState(null);
    const [modalProps, setModalProps] = useState(null);
    //@@viewOff:private

    const showDeleteActivityDialog = useCallback((activityName, onConfirm) => {
      setDialogProps({
        header: <Lsi import={importLsi} path={["Dialog", "deleteActivity", "header"]} />,
        icon: "mdi-delete",
        info: <Lsi import={importLsi} path={["Dialog", "deleteActivity", "info"]} />,
        actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
        actionList: [
          {
            children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
            onClick: (e) => setDialogProps(null),
          },
          {
            children: <Lsi import={importLsi} path={["Dialog", "deleteActivity", "submit"]} />,
            onClick: async (e) => {
              e.preventDefault();
              try {
                await onConfirm();
                setDialogProps(null);
                addAlert({
                  priority: "info",
                  header: { en: "Activity deleted", cs: "Aktivita smazána" },
                  message: {
                    en: `Activity '${activityName}' was successfully deleted.`,
                    cs: `Aktivita '${activityName}' byla úspěšně smazána.`,
                  },
                });
              } catch (error) {
                showError(error);
              }
            },
            colorScheme: "negative",
          },
        ],
      });
    }, []);

    const showDeleteDatetimeDialog = useCallback((onConfirm) => {
      setDialogProps({
        header: <Lsi import={importLsi} path={["Dialog", "deleteDatetime", "header"]} />,
        info: <Lsi import={importLsi} path={["Dialog", "deleteDatetime", "info"]} />,
        icon: "mdi-delete",
        actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
        actionList: [
          {
            children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
            onClick: () => setDialogProps(null),
          },
          {
            children: <Lsi import={importLsi} path={["Dialog", "deleteDatetime", "submit"]} />,
            colorScheme: "negative",
            onClick: async (e) => {
              e.preventDefault();
              try {
                await onConfirm();
                setDialogProps(null);
                addAlert({
                  priority: "info",
                  header: { en: "Datetime deleted", cs: "Termín smazán" },
                  message: {
                    en: `Datetime was successfully deleted.`,
                    cs: `Termín byl úspěšně smazán.`,
                  },
                });
              } catch (error) {
                showError(error);
              }
            },
          },
        ],
      });
    });

    const goToActivity = useCallback((id) => setRoute("activity", { id }), []);

    const showDatetimeModal = useCallback((id, activity) => setModalProps({ id, activity }));
    const handleDeleteDatetime = async (deleteHandler) => showDeleteDatetimeDialog(deleteHandler);

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

      const handleDeleteActivity = (activity) =>
        showDeleteActivityDialog(activity.name, async () => {
          return await handlerMap.delete({ id: activity.id });
        });

      const handleRefresh = async () => {
        return await handlerMap.load();
      };

      return (
        <ActivityList
          data={data}
          onDeleteActivity={handleDeleteActivity}
          onLoadNext={handlerMap.loadNext}
          onRefresh={handleRefresh}
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
        <ActivityListProvider pageSize={50}>
          {({ state, data, errorData, pendingData, handlerMap }) => {
            switch (state) {
              case "pendingNoData":
                return renderLoading();
              case "errorNoData":
                return renderError(errorData);
              case "error":
              case "pending":
              case "ready":
              case "readyNoData":
                const dataToRender = data.map((item) => {
                  if (item == null) return item;
                  return {
                    ...item.data,
                    members: item.data.members.length,
                    onClickGoToActivity: goToActivity,
                    onClickDatetime: showDatetimeModal,
                  };
                });
                return renderReady(dataToRender, handlerMap);
            }
          }}
        </ActivityListProvider>
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
        <DatetimeManagementModal
          {...modalProps}
          open={!!modalProps}
          onClose={() => setModalProps(null)}
          onDeleteDatetime={handleDeleteDatetime}
        />
      </Container>
    );
    //@@viewOff:render
  },
});

ActivityManagement = withRoute(ActivityManagement, { authenticated: true });

//@@viewOn:exports
export { ActivityManagement };
export default ActivityManagement;
//@@viewOff:exports
