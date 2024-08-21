//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useRoute, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import { withRoute } from "uu_plus4u5g02-app";
import { useAuthorization } from "../contexts/authorization-context.js";
import { Error, Unauthorized, useAlertBus } from "uu_plus4u5g02-elements";
import Container from "../bricks/container.js";
import { Dialog, Pending } from "uu5g05-elements";
import ActivityListProvider from "../providers/activity-list-provider.js";
import ActivityList from "../bricks/activity-list.js";
import importLsi from "../lsi/import-lsi.js";
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
    const { isAuthority, isExecutive } = useAuthorization();
    const [pageSize, setPageSize] = useState(50);
    const [shownPageIndex, setShownPageIndex] = useState(0);
    const [dialogProps, setDialogProps] = useState(null);
    //@@viewOff:private

    const showDialog = useCallback((activityName, onConfirm) => {
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

    const goToActivity = useCallback((id) => setRoute("activity", { id }), []);

    const goToDatetime = useCallback((id) => setRoute("management/datetime", { id }), []);

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
        showDialog(activity.name, async () => {
          return await handlerMap.delete({ id: activity.id });
        });

      return <ActivityList data={data} onDeleteActivity={handleDeleteActivity} onLoadNext={handlerMap.loadNext} />;
    }

    return (
      <Container
        style={{
          height: "calc(100vh-88px)",
          marginTop: "12px",
          maxWidth: "auto",
        }}
      >
        <ActivityListProvider pageSize={pageSize}>
          {({ state, data, errorData, pendingData, handlerMap }) => {
            const dataToRender = data
              ? data
                  .filter((item) => item != null)
                  .map((item) => ({
                    ...item.data,
                    members: item.data.members.length,
                    onClickGoToActivity: goToActivity,
                    onClickGoToDatetime: goToDatetime,
                  }))
              : [];
            switch (state) {
              case "pending":
                return renderReady(dataToRender, handlerMap);
              case "pendingNoData":
                return renderLoading();
              case "error":
                return renderReady(dataToRender, handlerMap);
              case "errorNoData":
                return renderError(errorData);
              case "ready":
              case "readyNoData":
                return renderReady(dataToRender, handlerMap);
            }
          }}
        </ActivityListProvider>
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
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
