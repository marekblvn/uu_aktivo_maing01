//@@viewOn:imports
import { createVisualComponent, Lsi, useEffect, useLsi, useScreenSize, useState } from "uu5g05";
import { Error } from "uu_plus4u5g02-elements";
import { ActionGroup, Block, CollapsibleBox, Pending } from "uu5g05-elements";
import { DateRange } from "uu5g05-forms";
import Config from "./config/config.js";
import Container from "./container.js";
import AttendanceListProvider from "../providers/attendance-list-provider.js";
import AttendanceList from "./attendance-list.js";
import importLsi from "../lsi/import-lsi.js";
import { ControllerProvider } from "uu5tilesg02";
import { FormSerieManager, SerieButton, SerieManagerModal, SorterBar, SorterButton } from "uu5tilesg02-controls";
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
    value: "confirmedCount",
    label: { en: "Came", cs: "Přišel(a)" },
    visible: true,
  },
  {
    value: "confirmedPercentage",
    label: { en: "Percentage of attended datetimes", cs: "Podíl navštívených termínů" },
    visible: false,
  },
  {
    value: "undecidedCount",
    label: { en: "Didn't decide", cs: "Nerozhodl(a) se" },
    visible: true,
  },
  {
    value: "undecidedPercentage",
    label: { en: "Percentage of undecided datetimes", cs: "Podíl nerozhodnutých termínů" },
    visible: false,
  },
  {
    value: "deniedCount",
    label: { en: "Didn't come", cs: "Nepřišel(a)" },
    visible: true,
  },
  {
    value: "deniedPercentage",
    label: { en: "Percentage of unattended datetimes", cs: "Podíl nenavštívených termínů" },
    visible: false,
  },
  {
    value: "total",
    label: { en: "Total datetimes", cs: "Celkem termínů" },
    visible: "always",
    fixed: "end",
  },
];

const SORTER_LIST = [
  {
    key: "confirmedCount",
    label: <Lsi lsi={{ en: "Came", cs: "Přišel(a)" }} />,
    sort: (a, b) => a.confirmedCount - b.confirmedCount,
  },
  {
    key: "undecidedCount",
    label: <Lsi lsi={{ en: "Didn't decide", cs: "Nerozhodl(a) se" }} />,
    sort: (a, b) => a.undecidedCount - b.undecidedCount,
  },
  {
    key: "deniedCount",
    label: <Lsi lsi={{ en: "Didn't come", cs: "Nepřišel(a)" }} />,
    sort: (a, b) => a.deniedCount - b.deniedCount,
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
    const [screenSize] = useScreenSize();
    const [dateRange, setDateRange] = useState(undefined);
    const [dateFilter, setDateFilter] = useState({ before: undefined, after: undefined });
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const [collapseDateRange, setCollapseDateRange] = useState(true);
    const [serieList, setSerieList] = useState(SERIE_LIST);
    const [sorterList, setSorterList] = useState();
    //@@viewOff:private

    useEffect(() => {
      if (dateRange?.filter((i) => i != null).length === 2) {
        setDateFilter({ after: dateRange[0], before: dateRange[1] });
      }
    }, [dateRange]);
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
      if (!data) {
        data = [];
      }

      const dataToRender = data
        .filter((item) => item != null)
        .map((item) => ({
          ...item.data,
          confirmedPercentage: (item.data.confirmedCount / item.data.total) * 100,
          undecidedPercentage: (item.data.undecidedCount / item.data.total) * 100,
          deniedPercentage: (item.data.deniedCount / item.data.total) * 100,
        }));

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
            actionList={[
              {
                icon: "mdi-calendar",
                onClick: () => setCollapseDateRange(!collapseDateRange),
              },
              { component: <SorterButton type="bar" /> },
              { component: <SerieButton /> },
            ]}
          >
            <CollapsibleBox collapsed={collapseDateRange}>
              <div
                style={{
                  display: "flex",
                  marginLeft: "16px",
                  padding: "8px 0px",
                  marginRight: "16px",
                  justifyContent: "start",
                }}
              >
                <DateRange
                  displayWeekNumbers={true}
                  weekStartDay={1}
                  value={dateRange}
                  onChange={(e) => setDateRange(e.data.value)}
                  format="D/M/YY"
                  style={{
                    minWidth: ["xl", "l", "m", "s"].includes(screenSize) ? "300px" : "160px",
                  }}
                />
                <ActionGroup
                  itemList={[
                    {
                      icon: "uugds-close",
                      onClick: () => setCollapseDateRange(true),
                      colorScheme: "neutral",
                    },
                  ]}
                />
              </div>
            </CollapsibleBox>
            <SerieManagerModal>
              <FormSerieManager />
            </SerieManagerModal>
            <SorterBar />
            <AttendanceList />
          </Block>
        </ControllerProvider>
      );
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
        <AttendanceListProvider activityId={activityId} dateFilter={dateFilter}>
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
      </Container>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityAttendanceView };
export default ActivityAttendanceView;
//@@viewOff:exports
