//@@viewOn:imports
import {
  createVisualComponent,
  Lsi,
  useCallback,
  useLsi,
  useLsiValues,
  useRef,
  useScreenSize,
  useState,
  Utils,
} from "uu5g05";
import Config from "./config/config.js";
import { Error, useAlertBus } from "uu_plus4u5g02-elements";
import {
  DateTime,
  Dialog,
  Grid,
  Line,
  ListLayout,
  Modal,
  Pending,
  PlaceholderBox,
  ScrollableBox,
} from "uu5g05-elements";
import importLsi from "../lsi/import-lsi.js";
import DatetimeProvider from "../providers/datetime-provider.js";
import ParticipationList from "./participation-list.js";
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

  render({ open, onClose, datetimeId, activity, onDeleteDatetime }) {
    //@@viewOn:private
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const placeholderLsi = useLsi({ import: importLsi, path: ["Placeholder", "noDatetime"] });
    const [dialogProps, setDialogProps] = useState(null);
    const deleteDatetimeRef = useRef();
    //@@viewOff:private

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
      if (!data) return null;

      const itemList = [
        {
          label: { en: "Activity", cs: "Aktivita" },
          children: activity.name,
        },
        {
          label: { en: "Datetime date", cs: "Datum termínu" },
          children: <DateTime value={data.datetime} />,
        },
        {
          label: { en: "Notification date", cs: "Datum upozornění" },
          children: <DateTime value={data.notification} />,
        },
      ];

      if (activity.recurrent) {
        const nextDatetime = new Date(data.datetime);
        nextDatetime.setMonth(
          nextDatetime.getMonth() + activity.frequency.months,
          nextDatetime.getDate() + activity.frequency.days,
        );
        const nextNotificationDate = new Date(nextDatetime);
        nextNotificationDate.setDate(nextNotificationDate.getDate() - activity.notificationOffset.days);
        nextNotificationDate.setHours(
          nextNotificationDate.getHours() - activity.notificationOffset.hours,
          nextNotificationDate.getMinutes() - activity.notificationOffset.minutes,
        );
        itemList.push(
          { divider: true },
          {
            label: { en: "Next datetime date", cs: "Datum příštího termínu" },
            children: <DateTime value={nextDatetime} />,
          },
          {
            label: { en: "Next datetime notification date", cs: "Datum upozornění příštího termínu" },
            children: <DateTime value={nextNotificationDate} />,
          },
        );
      }

      return (
        <Grid templateColumns={{ xs: "100%" }} alignItems="start">
          <ListLayout itemList={itemList} />
          <ScrollableBox maxHeight={300} minHeight={300}>
            <ParticipationList confirmed={data.confirmed} undecided={data.undecided} denied={data.denied} />
          </ScrollableBox>
        </Grid>
      );
    }

    return (
      <Modal
        open={open}
        onClose={onClose}
        header={<Lsi lsi={{ en: `Datetime: ${activity.name}`, cs: `Termín: ${activity.name}` }} />}
        width="800px"
        actionList={[
          {
            icon: "mdi-delete",
            colorScheme: "negative",
            significance: "subdued",
            onClick: () => onDeleteDatetime(deleteDatetimeRef.current, datetimeId),
          },
        ]}
      >
        <DatetimeProvider datetimeId={datetimeId}>
          {({ state, data, errorData, pendingData, handlerMap }) => {
            switch (state) {
              case "pendingNoData":
                return renderLoading();
              case "errorNoData":
                return renderError(errorData);
              case "readyNoData":
                return renderEmpty();
              case "pending":
              case "ready":
              case "error":
                deleteDatetimeRef.current = handlerMap.delete;
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
