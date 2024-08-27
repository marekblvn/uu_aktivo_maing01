//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useLsi, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import { withRoute } from "uu_plus4u5g02-app";
import { useAuthorization } from "../contexts/authorization-context.js";
import { Error, Unauthorized, useAlertBus } from "uu_plus4u5g02-elements";
import Container from "../bricks/container.js";
import { Dialog, Grid, Pending } from "uu5g05-elements";
import ActivityListProvider from "../providers/activity-list-provider.js";
import ActivityTable from "../bricks/activity-table.js";
import importLsi from "../lsi/import-lsi.js";
import { CancelButton, ResetButton, SubmitButton } from "uu5g05-forms";
import UpdateActivityForm from "../bricks/update-activity-form.js";
import UpdateFrequencyForm from "../bricks/update-frequency-form.js";
import UpdateNotificationOffsetForm from "../bricks/update-notification-offset-form.js";
import FormModal from "../bricks/form-modal.js";
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

const _ActivityManagement = createVisualComponent({
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
    const { isAuthority, isExecutive } = useAuthorization();
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const [screenSize] = useScreenSize();
    const [sorterList, setSorterList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [dialogProps, setDialogProps] = useState(null);
    const [modalProps, setModalProps] = useState(null);
    const [datetimeModalProps, setDatetimeModalProps] = useState(null);
    //@@viewOff:private

    const showDeleteActivityDialog = useCallback(
      (activity, onConfirm) => {
        setDialogProps({
          header: (
            <Lsi import={importLsi} path={["Dialog", "adminDeleteActivity", "header"]} params={[activity.name]} />
          ),
          icon: "mdi-delete",
          info: <Lsi import={importLsi} path={["Dialog", "adminDeleteActivity", "info"]} />,
          actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
          actionList: [
            {
              children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
              onClick: (e) => setDialogProps(null),
            },
            {
              children: <Lsi import={importLsi} path={["Dialog", "adminDeleteActivity", "confirm"]} />,
              onClick: onConfirm,
              colorScheme: "negative",
            },
          ],
        });
      },
      [setDialogProps],
    );

    const showUpdateModal = useCallback(
      (useCase, children, onSubmit) => {
        setModalProps({
          onSubmit: onSubmit,
          header: <Lsi import={importLsi} path={["Forms", useCase, "header"]} />,
          footer: (
            <Grid
              templateColumns={{ xs: "auto repeat(2,1fr)", s: "repeat(3,auto)" }}
              justifyContent={{ xs: "center", s: "end" }}
            >
              <ResetButton icon="uugds-refresh" significance="subdued" />
              <CancelButton onClick={() => setModalProps(null)} />
              <SubmitButton>
                <Lsi import={importLsi} path={["Forms", useCase, "submit"]} />
              </SubmitButton>
            </Grid>
          ),
          children,
        });
      },
      [setModalProps],
    );

    const handleOpenDatetimeModal = useCallback(
      (activity) => {
        setDatetimeModalProps({
          activity,
        });
      },
      [setDatetimeModalProps],
    );

    const handleDeleteActivity = useCallback(
      (activity) =>
        showDeleteActivityDialog(activity, async (e) => {
          e.preventDefault();
          try {
            await activity.handlerMap.delete({ id: activity.id });
            setDialogProps(null);
            addAlert({
              priority: "info",
              header: { en: `Activity '${activity.name}' deleted`, cs: `Aktivita '${activity.name}' smazána` },
              message: { en: "The activity was successfully deleted.", cs: "Aktivita byla úspěšně smazána." },
              durationMs: 2000,
            });
          } catch (error) {
            showError(error);
          }
        }),
      [],
    );

    const handleUpdateActivity = useCallback((activity) =>
      showUpdateModal("updateActivity", <UpdateActivityForm initialValues={activity} />, async (e) => {
        e.preventDefault();
        try {
          await activity.handlerMap.update({ id: activity.id, ...e.data.value });
          setModalProps(null);
          addAlert({
            priority: "info",
            header: { en: "Activity settings edited", cs: "Nastavení aktivity upraveno" },
            message: { en: "Changes you made were successfully saved.", cs: "Provedené změny byly úspěšně uloženy." },
            durationMs: 2000,
          });
        } catch (error) {
          showError(error);
        }
      }),
    );

    const handleUpdateFrequency = useCallback(
      async (activity) =>
        showUpdateModal(
          "updateFrequency",
          <UpdateFrequencyForm initialValues={activity.frequency} notificationOffset={activity.notificationOffset} />,
          async (e) => {
            e.preventDefault();
            try {
              const updatedActivity = await activity.handlerMap.updateFrequency({ id: activity.id, ...e.data.value });
              setModalProps(null);
              addAlert({
                priority: "info",
                header: { en: "Frequency updated", cs: "Frekvence změněna" },
                message: {
                  en: "Changes you made were successfully saved.",
                  cs: "Provedené změny byly úspěšně uloženy.",
                },
                durationMs: 2000,
              });
              setDatetimeModalProps({ activity: { ...updatedActivity, handlerMap: activity.handlerMap } });
            } catch (error) {
              showError(error);
            }
          },
        ),
      [],
    );

    const handleUpdateNotificationOffset = useCallback(
      async (activity) =>
        showUpdateModal(
          "updateNotificationOffset",
          <UpdateNotificationOffsetForm initialValues={activity.notificationOffset} frequency={activity.frequency} />,
          async (e) => {
            e.preventDefault();
            try {
              const updatedActivity = await activity.handlerMap.updateNotificationOffset({
                id: activity.id,
                notificationOffset: e.data.value,
              });
              setModalProps(null);
              addAlert({
                priority: "info",
                header: { en: "Notification offset updated", cs: "Posun upozornění změněn" },
                message: {
                  en: "Changes you made were successfully saved.",
                  cs: "Provedené změny byly úspěšně uloženy.",
                },
                durationMs: 2000,
              });
              setDatetimeModalProps({ activity: { ...updatedActivity, handlerMap: activity.handlerMap } });
            } catch (error) {
              showError(error);
            }
          },
        ),
      [],
    );

    const getActionList = useCallback(({ rowIndex, data }) => {
      return [
        {
          icon: "uugds-calendar",
          tooltip: { en: "Open datetime detail", cs: "Otevřít detail termínu" },
          onClick: () => handleOpenDatetimeModal(data),
          disabled: data.datetimeId === null,
        },
        {
          icon: "uugds-pencil",
          onClick: () => handleUpdateActivity(data),
          tooltip: { en: "Edit activity settings", cs: "Upravit nastavení aktivity" },
        },
        { divider: true },
        {
          icon: "uugds-delete",
          tooltip: { en: "Delete activity", cs: "Smazat aktivitu" },
          onClick: () => handleDeleteActivity(data),
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
          subtitle={{ en: "Super secret stuff is going on here...", cs: "Dějí se zde super tajné věci..." }}
        />
      );
    }

    function renderLoading() {
      return <Pending size="max" colorScheme="primary" />;
    }

    function renderError(errorData) {
      const errorCode = errorData.error?.code;
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
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
        <>
          <ActivityTable
            data={data}
            pending={pending}
            getActionList={getActionList}
            filterList={filterList}
            onFilterListChange={handleChangeFilterList}
            sorterList={sorterList}
            onSorterListChange={handleChangeSorterList}
            onRefresh={handleRefresh}
            onLoadNext={handleLoadNext}
          />
        </>
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
        <ActivityListProvider pageSize={100}>
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
        </ActivityListProvider>
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
        <FormModal {...modalProps} open={!!modalProps} onClose={() => setModalProps(null)} />
        <DatetimeManagementModal
          {...datetimeModalProps}
          open={!!datetimeModalProps}
          onClose={() => setDatetimeModalProps(null)}
          onUpdateFrequency={handleUpdateFrequency}
          onUpdateNotificationOffset={handleUpdateNotificationOffset}
        />
      </Container>
    );
    //@@viewOff:render
  },
});

const ActivityManagement = withRoute(_ActivityManagement, { authenticated: true });

//@@viewOn:exports
export { ActivityManagement };
export default ActivityManagement;
//@@viewOff:exports
