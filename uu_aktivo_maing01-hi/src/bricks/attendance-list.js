//@@viewOn:imports
import { createVisualComponent, Lsi } from "uu5g05";
import Config from "./config/config.js";
import { Icon, Number, PlaceholderBox } from "uu5g05-elements";
import { List } from "uu5tilesg02-elements";
import { PersonItem } from "uu_plus4u5g02-elements";
import AttendanceTile from "./attendance-tile.js";
//@@viewOff:imports

//@@viewOn:constants
const COLUMN_LIST = [
  {
    value: "uuIdentity",
    header: <Lsi lsi={{ en: "Member", cs: "Člen" }} />,
    headerComponent: <List.HeaderCell verticalAlignment="center" />,
    cell: ({ data }) => <PersonItem uuIdentity={data.uuIdentity} />,
  },
  {
    value: "confirmed",
    header: (
      <div style={{ display: "flex", columnGap: "4px", alignItems: "center", justifyContent: "center" }}>
        <Icon icon="uugdsstencil-communication-thumb-up" colorScheme="positive" />
        <Lsi lsi={{ cs: "Přišel(a)", en: "Came" }} />
      </div>
    ),
    headerComponent: <List.HeaderCell horizontalAlignment="center" verticalAlignment="center" />,
    cellComponent: <List.Cell horizontalAlignment="center" verticalAlignment="center" />,
    cell: ({ data }) => <Number value={data.confirmed} />,
  },
  {
    value: "confirmedPercentage",
    header: (
      <div style={{ display: "flex", columnGap: "4px", alignItems: "center", justifyContent: "center" }}>
        <Icon icon="uugdsstencil-communication-thumb-up" colorScheme="positive" />
        (%)
      </div>
    ),
    headerComponent: <List.HeaderCell horizontalAlignment="center" verticalAlignment="center" />,
    cellComponent: <List.Cell horizontalAlignment="center" verticalAlignment="center" />,
    cell: ({ data }) => <Number value={data.confirmedPercentage} unit="percent" roundingMode="halfExpand" />,
    maxWidth: "80px",
  },
  {
    value: "undecided",
    header: (
      <div style={{ display: "flex", columnGap: "4px", alignItems: "center", justifyContent: "center" }}>
        <Icon icon="uugds-help" colorScheme="neutral" />
        <Lsi lsi={{ en: "Didn't decide", cs: "Nerozhodnuto" }} />
      </div>
    ),
    headerComponent: <List.HeaderCell horizontalAlignment="center" verticalAlignment="center" />,
    cellComponent: <List.Cell horizontalAlignment="center" verticalAlignment="center" />,
    cell: ({ data }) => <Number value={data.undecided} />,
  },
  {
    value: "undecidedPercentage",
    header: (
      <div style={{ display: "flex", columnGap: "4px", alignItems: "center", justifyContent: "center" }}>
        <Icon icon="uugds-help" colorScheme="neutral" />
        (%)
      </div>
    ),
    headerComponent: <List.HeaderCell horizontalAlignment="center" verticalAlignment="center" />,
    cellComponent: <List.Cell horizontalAlignment="center" verticalAlignment="center" />,
    cell: ({ data }) => <Number value={data.undecidedPercentage} unit="percent" roundingMode="halfExpand" />,
    maxWidth: "80px",
  },
  {
    value: "denied",
    header: (
      <div style={{ display: "flex", columnGap: "4px", alignItems: "center", justifyContent: "center" }}>
        <Icon icon="uugdsstencil-communication-thumb-down" colorScheme="negative" />
        <Lsi lsi={{ en: "Didn't come", cs: "Nepřišel(la)" }} />
      </div>
    ),
    headerComponent: <List.HeaderCell horizontalAlignment="center" verticalAlignment="center" />,
    cellComponent: <List.Cell horizontalAlignment="center" verticalAlignment="center" />,
    cell: ({ data }) => <Number value={data.denied} />,
  },
  {
    value: "deniedPercentage",
    header: (
      <div style={{ display: "flex", columnGap: "4px", alignItems: "center", justifyContent: "center" }}>
        <Icon icon="uugdsstencil-communication-thumb-down" colorScheme="negative" />
        (%)
      </div>
    ),
    headerComponent: <List.HeaderCell horizontalAlignment="center" verticalAlignment="center" />,
    cellComponent: <List.Cell horizontalAlignment="center" verticalAlignment="center" />,
    cell: ({ data }) => <Number value={data.deniedPercentage} unit="percent" roundingMode="halfExpand" />,
    maxWidth: "80px",
  },
  {
    value: "datetimesAsMember",
    header: (
      <div style={{ display: "flex", columnGap: "4px", alignItems: "center", justifyContent: "center" }}>
        <Icon icon="uugdsstencil-commerce-sum" colorScheme="building" />
        <Lsi lsi={{ en: "Datetimes as member (%)", cs: "Termínů členem (%)" }} />
      </div>
    ),
    headerComponent: <List.HeaderCell horizontalAlignment="center" verticalAlignment="center" />,
    cellComponent: <List.Cell horizontalAlignment="center" verticalAlignment="center" />,
    cell: ({ data }) => (
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <div style={{ marginRight: "4px" }}>
          <Number value={data.datetimesAsMember} />
        </div>
        <div>
          {"("}
          <Number
            value={(data.datetimesAsMember / data.total) * 100}
            unit="percent"
            roundingMode="halfExpand"
            maxDecimalDigits={1}
            roundingPosition={-1}
          />
          {")"}
        </div>
      </div>
    ),
  },
];
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: Config.Css.css({}),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const AttendanceList = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AttendanceList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <List
        columnList={COLUMN_LIST}
        stickyHeader={true}
        displayCellSelection="none"
        emptyState={
          <PlaceholderBox
            code="items"
            header={{ en: "No attendance to display", cs: "Žádná docházka k zobrazení" }}
            info={{
              en: "There is no attendance available in selected date range.",
              cs: "V zadaném časovém rozmezí není dostupná žádná docházka.",
            }}
            style={{ margin: "16px" }}
          />
        }
      >
        {AttendanceTile}
      </List>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AttendanceList };
export default AttendanceList;
//@@viewOff:exports
