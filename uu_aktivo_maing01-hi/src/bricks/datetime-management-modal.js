//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useLsi, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import { Error, useAlertBus } from "uu_plus4u5g02-elements";
import { Button, DateTime, Dialog, Grid, Icon, ListLayout, Modal, Pending, PlaceholderBox } from "uu5g05-elements";
import importLsi from "../lsi/import-lsi.js";
import DatetimeProvider from "../providers/datetime-provider.js";
import { notificationOffsetToLsi } from "../../utils/notification-offset-utils.js";
import { frequencyToLsi } from "../../utils/frequency-utils.js";
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

const DatetimeManagementModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DatetimeManagementModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    activity: {},
  },
  //@@viewOff:defaultProps

  render({ open, onClose, activity, onUpdateFrequency, onUpdateNotificationOffset }) {
    //@@viewOn:private
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const placeholderLsi = useLsi({ import: importLsi, path: ["Placeholder", "noDatetime"] });
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const [screenSize] = useScreenSize();
    const [dialogProps, setDialogProps] = useState(null);
    //@@viewOff:private

    const showDeleteDatetimeDialog = useCallback(
      (onConfirm) => {
        setDialogProps({
          header: (
            <Lsi import={importLsi} path={["Dialog", "adminDeleteDatetime", "header"]} params={[activity.name]} />
          ),
          info: <Lsi import={importLsi} path={["Dialog", "adminDeleteDatetime", "info"]} />,
          icon: "mdi-delete",
          actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
          actionList: [
            {
              children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
              onClick: () => setDialogProps(null),
            },
            {
              children: <Lsi import={importLsi} path={["Dialog", "adminDeleteDatetime", "confirm"]} />,
              onClick: onConfirm,
              colorScheme: "negative",
            },
          ],
        });
      },
      [setDialogProps],
    );

    //@@viewOn:render
    function renderLoading() {
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Pending size="xl" colorScheme="primary" type="horizontal" />
        </div>
      );
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
              subtitle={errorLsi[errorCode]?.message || errorCode}
              error={errorData.error}
            />
          );
      }
    }

    function renderEmpty() {
      return <PlaceholderBox code="calendar" header={placeholderLsi.header} />;
    }

    function renderReady(data, handlerMap) {
      const handleDeleteDatetime = async (e) =>
        showDeleteDatetimeDialog(async (e) => {
          e.preventDefault();
          try {
            await handlerMap.delete({ id: data.id });
            setDialogProps(null);
            addAlert({
              priority: "info",
              header: { en: "Datetime deleted", cs: "Termín smazán" },
              message: {
                en: `Datetime of activity '${activity.name}' was successfully deleted.`,
                cs: `Termín aktivity '${activity.name}' byl úspěšně smazán.`,
              },
              durationMs: 2000,
            });
            onClose();
          } catch (error) {
            showError(error);
          }
        });

      const itemList = [
        {
          label: { en: "Activity", cs: "Aktivita" },
          children: activity.name,
        },
        {
          label: { en: "Recurrent", cs: "Opakující se" },
          children: <Icon icon={activity.recurrent ? "uugds-check" : "uugds-close"} />,
        },
        { divider: true },
        {
          label: { en: "Datetime date", cs: "Datum termínu" },
          children: <DateTime value={data.datetime} />,
        },
        {
          label: { en: "Notification date", cs: "Datum upozornění" },
          children: <DateTime value={data.notification} />,
        },
        { divider: true },
        {
          label: { en: "Notification offset", cs: "Posun upozornění" },
          children: <Lsi lsi={notificationOffsetToLsi(activity.notificationOffset)} />,
          actionList: [
            {
              icon: "uugds-pencil",
              onClick: () => onUpdateNotificationOffset(activity),
            },
          ],
        },
      ];

      if (activity.recurrent) {
        itemList.push({
          label: { en: "Frequency", cs: "Frekvence" },
          children: <Lsi lsi={frequencyToLsi(activity.frequency)} />,
          actionList: [
            {
              icon: "uugds-pencil",
              onClick: () => onUpdateFrequency(activity),
            },
          ],
        });
      }

      const collapsibleItems = [
        {
          label: { en: "Delete datetime", cs: "Smazat termín" },
          children: (
            <Button
              colorScheme="negative"
              significance="distinct"
              style={{ margin: "8px 0" }}
              onClick={handleDeleteDatetime}
            >
              <Lsi lsi={{ en: "Delete datetime", cs: "Smazat termín" }} />
            </Button>
          ),
        },
      ];

      return (
        <Grid templateColumns={{ xs: "100%" }} alignItems="start">
          <ListLayout itemList={itemList} collapsibleItemList={collapsibleItems} />
        </Grid>
      );
    }

    return (
      <Modal
        open={open}
        onClose={onClose}
        header={<Lsi lsi={{ en: "Datetime detail", cs: "Detail termínu" }} />}
        width="800px"
      >
        <DatetimeProvider datetimeId={activity.datetimeId}>
          {({ state, data, errorData, pendingData, handlerMap }) => {
            switch (state) {
              case "pendingNoData":
                return renderLoading();
              case "errorNoData":
                return renderError(errorData);
              case "readyNoData":
                return renderEmpty();
              case "error":
              case "pending":
              case "ready":
                return renderReady(data, handlerMap);
            }
          }}
        </DatetimeProvider>
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
      </Modal>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DatetimeManagementModal };
export default DatetimeManagementModal;
//@@viewOff:exports
