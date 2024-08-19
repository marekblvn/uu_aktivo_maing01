//@@viewOn:imports
import { createVisualComponent, Lsi, useLsi, useScreenSize, useState } from "uu5g05";
import { Error } from "uu_plus4u5g02-elements";
import { ActionGroup, Line, Pending, PlaceholderBox } from "uu5g05-elements";
import { DateRange } from "uu5g05-forms";
import Config from "./config/config.js";
import Container from "./container.js";
import AttendanceListProvider from "../providers/attendance-list-provider.js";
import AttendanceList from "./attendance-list.js";
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
    const [screenSize] = useScreenSize();
    const [dateRange, setDateRange] = useState(undefined);
    const [dateFilter, setDateFilter] = useState({ before: undefined, after: undefined });
    const [sort, setSort] = useState({});
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    //@@viewOff:private

    const handleChangeDateRange = ({ data }) => {
      setDateRange(data.value);
    };

    const handleLoadAttendance = () => {
      if (dateRange != undefined) {
        setDateFilter({ after: dateRange[0], before: dateRange[1] });
      }
    };

    const handleChangeSort = (key, order) => {
      if (sort[key] === order) {
        return setSort({});
      }
      return setSort({ [key]: order });
    };

    //@@viewOn:render

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

    function renderReady(data) {
      if (!data || data.length === 0)
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PlaceholderBox
              code="items"
              header={{ en: "No attendance to display", cs: "Žádná docházka k zobrazení" }}
              info={{
                en: "There is no attendance matching the specified parameters.",
                cs: "Neexistuje žádná docházka vyhovující zadaným parametrům.",
              }}
            />
          </div>
        );

      const dataToRender = data.filter((item) => item != null).map((item) => item.data);

      return <AttendanceList itemList={dataToRender} dateRange={dateFilter} />;
    }

    return (
      <Container
        style={{
          width: "100%",
          padding: "12px 8px 10px",
          border: "solid 1px rgb(33,33,33,0.11)",
          borderTop: "none",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          height: "100%",
        }}
      >
        <ActionGroup
          itemList={[
            {
              icon: "mdi-magnify",
              colorScheme: "primary",
              disabled: !dateRange,
              tooltip: !dateRange
                ? { en: "Please select a date range first", cs: "Prosím vyberte datové rozmezí" }
                : "",
              onClick: handleLoadAttendance,
            },
            {
              children: (
                <DateRange
                  displayWeekNumbers={true}
                  weekStartDay={1}
                  value={dateRange}
                  onChange={handleChangeDateRange}
                  size={["xl", "l", "m"].includes(screenSize) ? "m" : "s"}
                  format="D/M/YY"
                  style={{
                    width: ["xs"].includes(screenSize) ? "auto" : "300px",
                    minWidth: "140px",
                  }}
                />
              ),
            },
            {
              icon: "mdi-sort",
              iconNotification:
                Object.keys(sort).length > 0
                  ? sort["confirmedCount"]
                    ? { colorScheme: "positive" }
                    : sort["undecidedCount"]
                      ? { colorScheme: "neutral" }
                      : { colorScheme: "negative" }
                  : false,
              children: <Lsi lsi={{ en: "Sort by", cs: "Seřadit podle" }} />,
              openPosition: "bottom-center",
              colorScheme: "building",
              itemList: [
                {
                  icon: "uugdsstencil-communication-thumb-up",
                  children: <Lsi lsi={{ en: "Came", cs: "Přišel/la" }} />,
                  colorScheme: "positive",
                  significance: sort["confirmedCount"] ? "highlighted" : "common",
                  collapsible: true,
                  initialCollapsed: !sort["confirmedCount"],
                  itemList: [
                    {
                      icon: "mdi-arrow-up-thin",
                      children: <Lsi lsi={{ en: "Ascending", cs: "Vzestupně" }} />,
                      onClick: () => handleChangeSort("confirmedCount", 1),
                      iconRight: sort["confirmedCount"] === 1 ? "mdi-check" : "",
                    },
                    {
                      icon: "mdi-arrow-down-thin",
                      children: <Lsi lsi={{ en: "Descending", cs: "Sestupně" }} />,
                      onClick: () => handleChangeSort("confirmedCount", -1),
                      iconRight: sort["confirmedCount"] === -1 ? "mdi-check" : "",
                    },
                  ],
                },
                {
                  icon: "uugds-help",
                  children: <Lsi lsi={{ en: "Did not decide", cs: "Nerozhodl/la se" }} />,
                  colorScheme: "neutral",
                  significance: sort["undecidedCount"] ? "highlighted" : "common",
                  collapsible: true,
                  initialCollapsed: !sort["undecidedCount"],
                  itemList: [
                    {
                      icon: "mdi-arrow-up-thin",
                      children: <Lsi lsi={{ en: "Ascending", cs: "Vzestupně" }} />,
                      onClick: () => handleChangeSort("undecidedCount", 1),
                      iconRight: sort["undecidedCount"] === 1 ? "mdi-check" : "",
                    },
                    {
                      icon: "mdi-arrow-down-thin",
                      children: <Lsi lsi={{ en: "Descending", cs: "Sestupně" }} />,
                      onClick: () => handleChangeSort("undecidedCount", -1),
                      iconRight: sort["undecidedCount"] === -1 ? "mdi-check" : "",
                    },
                  ],
                },
                {
                  icon: "uugdsstencil-communication-thumb-down",
                  children: <Lsi lsi={{ en: "Didn't come", cs: "Nepřišel/la" }} />,
                  colorScheme: "negative",
                  significance: sort["deniedCount"] ? "highlighted" : "common",
                  collapsible: true,
                  initialCollapsed: !sort["deniedCount"],
                  itemList: [
                    {
                      icon: "mdi-arrow-up-thin",
                      children: <Lsi lsi={{ en: "Ascending", cs: "Vzestupně" }} />,
                      onClick: () => handleChangeSort("deniedCount", 1),
                      iconRight: sort["deniedCount"] === 1 ? "mdi-check" : "",
                      pressed: sort["deniedCount"] === 1,
                    },
                    {
                      icon: "mdi-arrow-down-thin",
                      children: <Lsi lsi={{ en: "Descending", cs: "Sestupně" }} />,
                      onClick: () => handleChangeSort("deniedCount", -1),
                      iconRight: sort["deniedCount"] === -1 ? "mdi-check" : "",
                      pressed: sort["deniedCount"] === -1,
                    },
                  ],
                },
              ],
            },
          ]}
        />
        <Line margin="12px 0 6px" significance="subdued" />
        <div style={{ padding: "2px 8px" }}>
          <AttendanceListProvider activityId={activityId} dateFilter={dateFilter} sort={sort}>
            {({ state, data, errorData, pendingData, handlerMap }) => {
              switch (state) {
                case "pending":
                case "pendingNoData":
                  return <Pending size="max" colorScheme="secondary" />;
                case "error":
                case "errorNoData":
                  return renderError(errorData);
                case "ready":
                case "readyNoData":
                  return renderReady(data);
              }
            }}
          </AttendanceListProvider>
        </div>
      </Container>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityAttendanceView };
export default ActivityAttendanceView;
//@@viewOff:exports
