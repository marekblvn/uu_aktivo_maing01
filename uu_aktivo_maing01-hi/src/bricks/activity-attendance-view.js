//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useLsi, useScreenSize, useState } from "uu5g05";
import { Error, useAlertBus } from "uu_plus4u5g02-elements";
import { Dialog, Pending } from "uu5g05-elements";
import { DateRange } from "uu5g05-forms";
import Config from "./config/config.js";
import Container from "./container.js";
import AttendanceListProvider from "../providers/attendance-list-provider.js";
import { useActivityAuthorization } from "../contexts/activity-authorization-context.js";
import AttendanceList from "./attendance-list.js";
import importLsi from "../lsi/import-lsi.js";
import { ControllerProvider } from "uu5tilesg02";
import AttendanceDetailModal from "./attendance-detail-modal.js";
import { useAuthorization } from "../contexts/authorization-context.js";
import AttendanceTile from "./attendance-tile.js";
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
    key: "datetime",
    label: { en: "Datetime date", cs: "Datum termínu" },
    inputType: DateRange.Input,
    inputProps: {
      placeholder: { en: "Select a datetime range", cs: "Vyberte datové rozmezí" },
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

const ActivityAttendanceView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityAttendanceView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ activityId }) {
    //@@viewOn:private
    const { isAuthority, isExecutive } = useAuthorization();
    const { isOwner, isAdministrator } = useActivityAuthorization();
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const [screenSize] = useScreenSize();
    const [filterList, setFilterList] = useState([]);
    const [sorterList, setSorterList] = useState([]);
    const [dialogProps, setDialogProps] = useState(null);
    const [modalProps, setModalProps] = useState(null);
    const canDeleteAttendance = isAdministrator || isOwner || isExecutive || isAuthority;
    //@@viewOff:private

    const showDeleteAttendanceDialog = useCallback(
      (onConfirm) => {
        setDialogProps({
          header: <Lsi import={importLsi} path={["Dialog", "deleteAttendance", "header"]} />,
          icon: "mdi-delete",
          info: <Lsi import={importLsi} path={["Dialog", "deleteAttendance", "info"]} />,
          actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
          actionList: [
            {
              children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
              onClick: () => setDialogProps(null),
            },
            {
              children: <Lsi import={importLsi} path={["Dialog", "deleteAttendance", "confirm"]} />,
              onClick: onConfirm,
              colorScheme: "negative",
            },
          ],
        });
      },
      [setDialogProps],
    );

    const showAttendanceDetailModal = useCallback(
      (attendance) => {
        setModalProps({
          data: attendance,
        });
      },
      [setModalProps],
    );

    const handleDeleteAttendance = useCallback(
      (attendance) =>
        showDeleteAttendanceDialog(async (e) => {
          e.preventDefault();
          try {
            await attendance.handlerMap.delete({ id: attendance.id });
            setDialogProps(null);
            setModalProps(null);
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
          await onSuccess();
        }),
      [],
    );

    const getActionList = useCallback(({ rowIndex, data }) => {
      return canDeleteAttendance
        ? [
            {
              icon: "uugds-open-in-modal",
              tooltip: { en: "Open detail", cs: "Otevřít detail" },
              onClick: () => showAttendanceDetailModal(data),
            },
            { divider: true },
            {
              icon: "uugds-delete",
              tooltip: { en: "Delete attendance", cs: "Smazat docházku" },
              onClick: () => handleDeleteAttendance(data),
              colorScheme: "negative",
            },
          ]
        : [
            {
              icon: "uugds-open-in-modal",
              tooltip: { en: "Open detail", cs: "Otevřít detail" },
              onClick: () => showAttendanceDetailModal(data),
            },
          ];
    }, []);

    //@@viewOn:render
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
        await handlerMap.load({ filters: { activityId, ...filters }, sort });
      };

      const handleChangeSorterList = async (e) => {
        const sort = {};
        const filters = {};
        setSorterList(e.data.sorterList);
        e.data.sorterList.forEach((item) => {
          const { key, ascending } = item;
          sort[key] = ascending ? 1 : -1;
        });
        filterList.forEach((item) => {
          const { key, value } = item;
          filters[key] = value;
        });
        await handlerMap.load({ filters: { activityId, ...filters }, sort });
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
        await handlerMap.load({ filters: { activityId, ...filters }, sort });
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
        await handlerMap.loadNext({ filters: { activityId, ...filters }, sort });
      };

      const handleDeleteBulk = async (data, onSuccess) => {
        const attendanceIdList = data.map((item) => item.id);
        await handleDeleteBulkAttendance(attendanceIdList, handlerMap.deleteBulk, () => {
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
          handlerMap.load({ filters: { activityId, ...filters }, sort });
        });
      };

      return (
        <ControllerProvider
          data={dataToRender}
          selectable={canDeleteAttendance ? "multiple" : "none"}
          sorterDefinitionList={SORTER_LIST}
          sorterList={sorterList}
          onSorterChange={handleChangeSorterList}
          filterDefinitionList={FILTER_LIST}
          filterList={filterList}
          onFilterChange={handleChangeFilterList}
        >
          <AttendanceList
            data={data}
            pending={pending}
            getActionList={getActionList}
            onDeleteBulk={handleDeleteBulk}
            onRefresh={handleRefresh}
            onLoadNext={handleLoadNext}
          >
            <AttendanceTile onDelete={handleDeleteAttendance} onOpenDetail={showAttendanceDetailModal} />
          </AttendanceList>
        </ControllerProvider>
      );
    }

    return (
      <Container
        style={{
          width: "100%",
          padding: "16px 24px 10px",
          border: "solid 1px rgb(33,33,33, 0.11)",
          borderTop: "none",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          height: "100%",
        }}
      >
        <AttendanceListProvider pageSize={50} filters={{ activityId }}>
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
        <AttendanceDetailModal {...modalProps} open={!!modalProps} onClose={() => setModalProps(null)} />
      </Container>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityAttendanceView };
export default ActivityAttendanceView;
//@@viewOff:exports
