//@@viewOn:imports
import { createVisualComponent, Fragment, Lsi, useCall, useEffect, useLsi, useScreenSize, useState } from "uu5g05";
import { Error } from "uu_plus4u5g02-elements";
import { ActionGroup, Block, Button, CollapsibleBox, Grid, Pending, Text, Toggle } from "uu5g05-elements";
import { DateRange } from "uu5g05-forms";
import Config from "./config/config.js";
import Container from "./container.js";
import AttendanceListProvider from "../providers/attendance-list-provider.js";
import AttendanceList from "./attendance-list.js";
import importLsi from "../lsi/import-lsi.js";
import { ControllerProvider } from "uu5tilesg02";
import { FormSerieManager, SerieButton, SerieManagerModal, SorterBar, SorterButton } from "uu5tilesg02-controls";
import Calls from "../calls.js";
//@@viewOff:imports

//@@viewOn:constants
const SERIE_LIST = [
  {
    value: "uuIdentity",
    label: { en: "Member", cs: "Člen" },
    visible: "always",
    fixed: "start",
  },
  {
    value: "confirmed",
    label: { en: "Came", cs: "Přišel(a)" },
    visible: true,
  },
  {
    value: "confirmedPercentage",
    label: { en: "Percentage of attended datetimes", cs: "Podíl navštívených termínů" },
    visible: false,
  },
  {
    value: "undecided",
    label: { en: "Didn't decide", cs: "Nerozhodl(a) se" },
    visible: true,
  },
  {
    value: "undecidedPercentage",
    label: { en: "Percentage of undecided datetimes", cs: "Podíl nerozhodnutých termínů" },
    visible: false,
  },
  {
    value: "denied",
    label: { en: "Didn't come", cs: "Nepřišel(a)" },
    visible: true,
  },
  {
    value: "deniedPercentage",
    label: { en: "Percentage of unattended datetimes", cs: "Podíl nenavštívených termínů" },
    visible: false,
  },
  {
    value: "datetimesAsMember",
    label: { en: "Datetimes as member", cs: "Termínů členem" },
    visible: true,
  },
];

const SORTER_LIST = [
  {
    key: "confirmed",
    label: <Lsi lsi={{ en: "Came", cs: "Přišel(a)" }} />,
    sort: (a, b) => a.confirmed - b.confirmed,
  },
  {
    key: "undecided",
    label: <Lsi lsi={{ en: "Didn't decide", cs: "Nerozhodl(a) se" }} />,
    sort: (a, b) => a.undecided - b.undecided,
  },
  {
    key: "denied",
    label: <Lsi lsi={{ en: "Didn't come", cs: "Nepřišel(a)" }} />,
    sort: (a, b) => a.denied - b.denied,
  },
  {
    key: "datetimesAsMember",
    label: <Lsi lsi={{ en: "Datetimes as member", cs: "Termínů členem" }} />,
    sort: (a, b) => a.datetimesAsMember - b.datetimesAsMember,
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
    const { call: callGetStatistics, state, data, errorData } = useCall(Calls.Attendance.getStatistics);
    const [screenSize] = useScreenSize();
    const [dateFilter, setDateFilter] = useState();
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const [hideFilters, setHideFilters] = useState(false);
    const [archivedFilter, setArchivedFilter] = useState(false);
    const [serieList, setSerieList] = useState(SERIE_LIST);
    const [sorterList, setSorterList] = useState();
    //@@viewOff:private

    const handleLoadStatistics = async (e) => {
      const filters = {
        activityId,
        after: dateFilter[0],
        before: dateFilter[1],
        archived: archivedFilter,
      };
      await callGetStatistics({ filters });
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
      let dataToRender = [];
      if (data) {
        dataToRender = data.statistics?.map((item) => ({
          ...item,
          confirmedPercentage: (item.confirmed / item.total) * 100,
          undecidedPercentage: (item.undecided / item.total) * 100,
          deniedPercentage: (item.denied / item.total) * 100,
          datetimesAsMember: item.confirmed + item.denied + item.undecided,
        }));
      }

      return (
        <ControllerProvider
          data={dataToRender}
          itemIdentifier="uuIdentity"
          selectable="none"
          serieList={serieList}
          onSerieChange={(e) => setSerieList(e.data.serieList)}
          sorterDefinitionList={SORTER_LIST}
          sorterList={sorterList}
          onSorterChange={(e) => setSorterList(e.data.sorterList)}
        >
          <Block
            header={
              <div style={{ display: "flex", columnGap: "8px", alignItems: "center", color: "rgb(0,0,0,0.45)" }}>
                <Button icon="mdi-magnify" disabled={dateFilter === undefined} onClick={handleLoadStatistics} />
                <DateRange
                  autoFocus
                  displayWeekNumbers={true}
                  weekStartDay={1}
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.data.value)}
                  format="D/M/YY"
                  style={{
                    minWidth: ["xl", "l", "m", "s"].includes(screenSize) ? "300px" : "120px",
                    maxWidth: ["xl", "l", "m"].includes(screenSize) ? "300px" : screenSize === "m" ? "240px" : "120px",
                  }}
                />
              </div>
            }
            actionList={[
              { icon: "uugds-filter", onClick: () => setHideFilters(!hideFilters) },
              { component: <SorterButton type="bar" /> },
              { component: <SerieButton /> },
            ]}
          >
            <CollapsibleBox collapsed={hideFilters}>
              <Grid
                templateRows={{ xs: "100%" }}
                templateColumns={{ xs: "auto auto" }}
                columnGap={{ xs: "18px", m: "28px" }}
                style={{ padding: "8px", marginLeft: "8px", marginRight: "8px" }}
              >
                <Toggle
                  label={{ en: "Archived attendance", cs: "Archivovaná docházka" }}
                  tooltip={{ cs: "Docházka netýkající se probíhajícího termínu", en: "Attendance of past datetimes" }}
                  value={archivedFilter}
                  onChange={(e) => setArchivedFilter(e.data.value)}
                />
                <ActionGroup
                  itemList={[
                    {
                      icon: "uugds-close",
                      colorScheme: "neutral",
                      significance: "subdued",
                      onClick: () => setHideFilters(true),
                    },
                  ]}
                />
              </Grid>
            </CollapsibleBox>
            <SerieManagerModal>
              <FormSerieManager />
            </SerieManagerModal>
            <SorterBar />
            {dataToRender.length > 0 && (
              <Text
                style={{ display: "flex", justifyContent: "end", alignItems: "center", padding: "8px" }}
                colorScheme="neutral"
                significance="subdued"
                category="story"
                segment="body"
                type={["xs", "s"].includes(screenSize) ? "minor" : "common"}
              >
                <Lsi
                  lsi={{
                    en: `${dataToRender[0].total} datetimes total`,
                    cs: `Celkem ${dataToRender[0].total} termínů`,
                  }}
                />
              </Text>
            )}
            <AttendanceList />
          </Block>
        </ControllerProvider>
      );
    }

    function renderContent(state) {
      switch (state) {
        case "pendingNoData":
          return (
            <div
              style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}
            >
              <Pending size="xl" colorScheme="secondary" />
            </div>
          );
        case "error":
        case "errorNoData":
          return renderError(errorData);
        case "pending":
        case "ready":
        case "readyNoData":
          return renderReady(data);
      }
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
        {renderContent(state)}
      </Container>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityAttendanceView };
export default ActivityAttendanceView;
//@@viewOff:exports
