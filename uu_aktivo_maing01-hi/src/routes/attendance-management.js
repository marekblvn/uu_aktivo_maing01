//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useLsi, useScreenSize, useState } from "uu5g05";
import { Dialog, Pending } from "uu5g05-elements";
import { useAlertBus, Error } from "uu_plus4u5g02-elements";
import { withRoute } from "uu_plus4u5g02-app";
import { Text } from "uu5g05-forms";
import Config from "./config/config.js";
import { useAuthorization } from "../contexts/authorization-context.js";
import Container from "../bricks/container.js";
import AttendanceListProvider from "../providers/attendance-list-provider.js";
import importLsi from "../lsi/import-lsi.js";
import AttendanceTable from "../bricks/attendance-table.js";
import { ControllerProvider } from "uu5tilesg02";
//@@viewOff:imports

//@@viewOn:constants
const SORTER_LIST = [
  {
    key: "datetime",
    label: { en: "Datetime date", cs: "Datum termínu" },
  },
];

const FILTER_LIST = [
  {
    key: "activityId",
    label: { en: "Activity ID", cs: "ID aktivity" },
    inputType: Text.Input,
    inputProps: {
      placeholder: { en: "Enter activity ID", cs: "Zadejte ID aktivity" },
      pattern: "^[a-fA-F0-9]{24}$",
    },
  },
  {
    key: "datetime",
    label: { en: "Datetime date", cs: "Datum termínu" },
    inputType: "date-range",
    inputProps: {
      placeholder: { en: "Select a date range", cs: "Vyberte datové rozmezí" },
    },
  },
];
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: (props) => Config.Css.css({}),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const _AttendanceManagement = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AttendanceManagement",
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
    const { showError, addAlert } = useAlertBus();
    const [screenSize] = useScreenSize();
    const [sorterList, setSorterList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [dialogProps, setDialogProps] = useState(null);
    //@@viewOff:private

    const showDeleteAttendanceDialog = useCallback(
      (onConfirm) => {
        setDialogProps({
          header: <Lsi import={importLsi} path={["Dialog", "adminDeleteAttendance", "header"]} />,
          icon: "mdi-delete",
          info: <Lsi import={importLsi} path={["Dialog", "adminDeleteAttendance", "info"]} />,
          actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
          actionList: [
            {
              children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
              onClick: () => setDialogProps(null),
            },
            {
              children: <Lsi import={importLsi} path={["Dialog", "adminDeleteAttendance", "confirm"]} />,
              onClick: onConfirm,
              colorScheme: "negative",
            },
          ],
        });
      },
      [setDialogProps],
    );

    const handleDeleteAttendance = useCallback(
      (attendance) =>
        showDeleteAttendanceDialog(async (e) => {
          e.preventDefault();
          try {
            await attendance.handlerMap.delete({ id: attendance.id });
            setDialogProps(null);
            addAlert({
              priority: "info",
              header: { en: "Attendance deleted", cs: "Docházka smazána" },
              message: { en: "The attendance was successfully deleted.", cs: "Docházka byla úspěšně smazána." },
              durationMs: 2000,
            });
          } catch (error) {
            showError(error);
          }
        }),
      [],
    );

    const handleDeleteBulkAttendance = useCallback(
      (attendanceIdList, handlerFn, onSuccess) =>
        showDeleteAttendanceDialog(async (e) => {
          e.preventDefault();
          try {
            await handlerFn({ idList: attendanceIdList });
            setDialogProps(null);
            addAlert({
              priority: "info",
              header: { en: "Attendances deleted", cs: "Docházky smazány" },
              message: {
                en: "The selected attendances were successfully deleted.",
                cs: "Vybrané docházky byly úspěšně smazány.",
              },
              durationMs: 2000,
            });
          } catch (error) {
            showError(error);
          }
          onSuccess();
        }),
      [],
    );

    const getActionList = useCallback(({ rowIndex, data }) => {
      return [
        {
          icon: "uugds-delete",
          tooltip: { en: "Delete attendance", cs: "Smazat docházku" },
          onClick: () => handleDeleteAttendance(data),
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

    function renderReady(data, state, handlerMap) {
      const pending = state === "pending" || state === "itemPending";
      const dataToRender = data
        .filter((item) => item != null)
        .map((item) => ({ ...item.data, handlerMap: item.handlerMap }));

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
        sorterList.forEach((item) => {
          const { key, ascending } = item;
          sort[key] = ascending ? 1 : -1;
        });
        filterList.forEach((item) => {
          const { key, value } = item;
          filters[key] = value;
        });
        await handlerMap.load({ filters, sort });
      };

      const handleLoadNext = async () => {
        const filters = {};
        const sort = {};
        sorterList.forEach((item) => {
          const { key, ascending } = item;
          sort[key] = ascending ? 1 : -1;
        });
        filterList.forEach((item) => {
          const { key, value } = item;
          filters[key] = value;
        });
        await handlerMap.loadNext({ filters, sort });
      };

      const handleDeleteBulk = (data, onSuccess) => {
        const attendanceIdList = data.map((item) => item.id);
        handleDeleteBulkAttendance(attendanceIdList, handlerMap.deleteBulk, () => {
          onSuccess();
          const filters = {};
          const sort = {};
          sorterList.forEach((item) => {
            const { key, ascending } = item;
            sort[key] = ascending ? 1 : -1;
          });
          filterList.forEach((item) => {
            const { key, value } = item;
            filters[key] = value;
          });
          handlerMap.load({ filters, sort });
        });
      };

      return (
        <ControllerProvider
          data={dataToRender}
          sorterDefinitionList={SORTER_LIST}
          sorterList={sorterList}
          onSorterChange={handleChangeSorterList}
          filterDefinitionList={FILTER_LIST}
          filterList={filterList}
          onFilterChange={handleChangeFilterList}
          selectable="multiple"
        >
          <AttendanceTable
            data={data}
            pending={pending}
            getActionList={getActionList}
            onDeleteBulk={handleDeleteBulk}
            onRefresh={handleRefresh}
            onLoadNext={handleLoadNext}
          />
        </ControllerProvider>
      );
    }

    return (
      <Container
        style={{
          height: "calc(100vh - 88px)",
          marginTop: "12px",
        }}
      >
        <AttendanceListProvider pageSize={100}>
          {({ state, data, errorData, handlerMap }) => {
            switch (state) {
              case "pendingNoData":
                return renderLoading();
              case "errorNoData":
                return renderError(errorData);
              case "error":
                showError(errorData);
              case "pending":
              case "itemPending":
              case "ready":
              case "readyNoData":
                return renderReady(data, state, handlerMap);
            }
          }}
        </AttendanceListProvider>
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
      </Container>
    );
    //@@viewOff:render
  },
});

const AttendanceManagement = withRoute(_AttendanceManagement, { authenticated: true });

//@@viewOn:exports
export { AttendanceManagement };
export default AttendanceManagement;
//@@viewOff:exports
