//@@viewOn:imports
import { createVisualComponent, Lsi, useLsi, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import Container from "./container.js";
import { ActionGroup, Line, Pending, PlaceholderBox, RichIcon } from "uu5g05-elements";
import { Error } from "uu_plus4u5g02-elements";
import AttendanceListProvider from "../providers/attendance-list-provider.js";
import { DateRange } from "uu5g05-forms";
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
    const [sortKey, setSortKey] = useState(undefined);
    const [sortOrder, setSortOrder] = useState(0);
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

    const handleChangeSort = (e, key) => {
      e.preventDefault();
      if (sortKey === key) {
        if (sortOrder === 1) {
          return setSortOrder(-1);
        } else {
          setSortKey(undefined);
          return setSortOrder(0);
        }
      } else {
        setSortKey(key);
        return setSortOrder(1);
      }
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

      return <AttendanceList itemList={dataToRender} />;
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
          alignment="right"
          collapsedMenuProps={{
            labelAlignment: "stretch",
            colorScheme: "neutral",
            significance: "subdued",
          }}
          itemList={[
            {
              icon: "mdi-magnify",
              primary: true,
              colorScheme: "primary",
              significance: "common",
              disabled: !dateRange,
              tooltip: !dateRange
                ? { en: "Please select a date range first", cs: "Prosím vyberte datové rozmezí" }
                : "",
              onClick: handleLoadAttendance,
            },
            {
              component: (
                <DateRange
                  displayWeekNumbers={true}
                  weekStartDay={1}
                  value={dateRange}
                  onChange={handleChangeDateRange}
                  size={["xl", "l", "m"].includes(screenSize) ? "m" : "s"}
                  format="D/M/YY"
                  style={{
                    width: ["xs"].includes(screenSize) ? "auto" : "300px",
                    minWidth: "100px",
                  }}
                />
              ),
            },
            {
              icon: "uugdsstencil-communication-thumb-up",
              iconRight:
                screenSize !== "xs" && sortKey === "confirmedCount"
                  ? sortOrder === 1
                    ? "mdi-arrow-up-thin"
                    : "mdi-arrow-down-thin"
                  : "",
              colorScheme: sortKey === "confirmedCount" ? "positive" : "building",
              significance: "distinct",
              onClick: (e) => handleChangeSort(e, "confirmedCount"),
              pressed: sortKey === "confirmedCount" ? true : false,
              size: ["xl", "l", "m"].includes(screenSize) ? "m" : screenSize === "s" ? "s" : "m",
              collapsed: screenSize === "xs",
              collapsedChildren: (
                <>
                  <Lsi
                    lsi={
                      sortKey === "confirmedCount"
                        ? {
                            en: sortOrder === 1 ? "Ascending" : "Descending",
                            cs: sortOrder === 1 ? "Vzestupně" : "Sestupně",
                          }
                        : {}
                    }
                  />
                  {sortKey === "confirmedCount" && (
                    <RichIcon
                      icon={sortOrder === 1 ? "mdi-arrow-up-thin" : "mdi-arrow-down-thin"}
                      colorScheme="positive"
                      significance="subdued"
                      size="xs"
                    />
                  )}
                </>
              ),
            },
            {
              icon: "uugds-help",
              iconRight:
                screenSize !== "xs" && sortKey === "undecidedCount"
                  ? sortOrder === 1
                    ? "mdi-arrow-up-thin"
                    : "mdi-arrow-down-thin"
                  : "",
              colorScheme: sortKey === "undecidedCount" ? "neutral" : "building",
              significance: "distinct",
              onClick: (e) => handleChangeSort(e, "undecidedCount"),
              pressed: sortKey === "undecidedCount" ? true : false,
              size: ["xl", "l", "m"].includes(screenSize) ? "m" : screenSize === "s" ? "s" : "m",
              collapsed: screenSize === "xs",
              collapsedChildren: (
                <>
                  <Lsi
                    lsi={
                      sortKey === "undecidedCount"
                        ? {
                            en: sortOrder === 1 ? "Ascending" : "Descending",
                            cs: sortOrder === 1 ? "Vzestupně" : "Sestupně",
                          }
                        : {}
                    }
                  />
                  {sortKey === "undecidedCount" && (
                    <RichIcon
                      icon={sortOrder === 1 ? "mdi-arrow-up-thin" : "mdi-arrow-down-thin"}
                      colorScheme="neutral"
                      significance="subdued"
                      size="xs"
                    />
                  )}
                </>
              ),
            },
            {
              icon: "uugdsstencil-communication-thumb-down",
              iconRight:
                screenSize !== "xs" && sortKey === "deniedCount"
                  ? sortOrder === 1
                    ? "mdi-arrow-up-thin"
                    : "mdi-arrow-down-thin"
                  : "",
              colorScheme: sortKey === "deniedCount" ? "negative" : "building",
              significance: "distinct",
              onClick: (e) => handleChangeSort(e, "deniedCount"),
              pressed: sortKey === "deniedCount" ? true : false,
              size: ["xl", "l", "m"].includes(screenSize) ? "m" : screenSize === "s" ? "s" : "m",
              collapsed: screenSize === "xs",
              collapsedChildren: (
                <>
                  <Lsi
                    lsi={
                      sortKey === "deniedCount"
                        ? {
                            en: sortOrder === 1 ? "Ascending" : "Descending",
                            cs: sortOrder === 1 ? "Vzestupně" : "Sestupně",
                          }
                        : {}
                    }
                  />
                  {sortKey === "deniedCount" && (
                    <RichIcon
                      icon={sortOrder === 1 ? "mdi-arrow-up-thin" : "mdi-arrow-down-thin"}
                      colorScheme="negative"
                      significance="subdued"
                      size="xs"
                    />
                  )}
                </>
              ),
            },
          ]}
        />
        <Line margin="12px 0" significance="subdued" />
        <div style={{ padding: "16px 8px" }}>
          <AttendanceListProvider
            activityId={activityId}
            dateFilter={dateFilter}
            sortKey={sortKey}
            sortOrder={sortOrder}
          >
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
