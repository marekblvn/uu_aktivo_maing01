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
    const { isAuthority, isExecutive } = useAuthorization();
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const [screenSize] = useScreenSize();
    const [sorterList, setSorterList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [dialogProps, setDialogProps] = useState(null);
    const [modalProps, setModalProps] = useState(null);
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

    const showUpdateActivityModal = useCallback(
      (activity, onSubmit) => {
        setModalProps({
          onSubmit: onSubmit,
          header: <Lsi import={importLsi} path={["Forms", "updateActivity", "header"]} />,
          footer: (
            <Grid
              templateColumns={{ xs: "auto repeat(2,1fr)", s: "repeat(3,auto)" }}
              justifyContent={{ xs: "center", s: "end" }}
            >
              <ResetButton icon="uugds-refresh" significance="subdued" />
              <CancelButton onClick={() => setModalProps(null)} />
              <SubmitButton>
                <Lsi import={importLsi} path={["Forms", "updateActivity", "submit"]} />
              </SubmitButton>
            </Grid>
          ),
          children: <UpdateActivityForm initialValues={activity} />,
        });
      },
      [setModalProps],
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
      showUpdateActivityModal(activity, async (e) => {
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

    const getActionList = useCallback(({ rowIndex, data }) => {
      return [
        {
          icon: "uugds-pencil",
          tooltip: { en: "Edit activity settings", cs: "Změnit nastavení aktivity" },
          onClick: () => handleUpdateActivity(data),
        },
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
                showError(error);
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
