//@@viewOn:imports
import { AutoLoad, createVisualComponent, Lsi } from "uu5g05";
import { useController } from "uu5tilesg02";
import { FilterBar, FilterButton, SorterButton, BulkActionBar } from "uu5tilesg02-controls";
import { Table } from "uu5tilesg02-elements";
import Config from "./config/config.js";
import { Block, DateTime, Link, Number, Pending, RichIcon, Text } from "uu5g05-elements";
//@@viewOff:imports

//@@viewOn:constants
const COLUMN_LIST = [
  {
    value: "activityId",
    header: <Lsi lsi={{ en: "Activity ID", cs: "ID aktivity" }} />,
    cell: ({ data }) => (
      <Link
        href={`activity?id=${data.activityId}&tab=information`}
        target="_blank"
        tooltip={{ en: "Go to activity page", cs: "Přejít na stránku aktivity" }}
      >
        {data.activityId}
      </Link>
    ),
  },
  {
    value: "datetime",
    header: <Lsi lsi={{ en: "Datetime date", cs: "Datum termínu" }} />,
    cell: ({ data }) => <DateTime value={data.datetime} timeFormat="medium" dateFormat="long" />,
  },
  {
    value: "confirmed",
    header: <Lsi lsi={{ en: "Confirmed", cs: "Potvrdilo" }} />,
    headerComponent: <Table.HeaderCell horizontalAlignment="center" />,
    cell: ({ data }) => <Number value={data.confirmed.length} />,
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    maxWidth: "108px",
  },
  {
    value: "undecided",
    header: <Lsi lsi={{ en: "Undecided", cs: "Nerozhodlo se" }} />,
    headerComponent: <Table.HeaderCell horizontalAlignment="center" />,
    cell: ({ data }) => <Number value={data.undecided.length} />,
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    maxWidth: "140px",
  },
  {
    value: "denied",
    header: <Lsi lsi={{ en: "Denied", cs: "Odmítlo" }} />,
    headerComponent: <Table.HeaderCell horizontalAlignment="center" />,
    cell: ({ data }) => <Number value={data.denied.length} />,
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    maxWidth: "100px",
  },
  {
    value: "cts",
    header: <Lsi lsi={{ en: "Saved at", cs: "Vytvořeno v" }} />,
    cell: ({ data }) => <DateTime value={data.sys.cts || ""} timeFormat="medium" dateFormat="medium" />,
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

const AttendanceTable = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AttendanceTable",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    data: [],
    pending: false,
    getActionList: () => [],
    onDeleteBulk: () => {},
    onLoadNext: () => {},
    onRefresh: () => {},
  },
  //@@viewOff:defaultProps

  render({ data, pending, getActionList, onDeleteBulk, onLoadNext, onRefresh }) {
    //@@viewOn:private
    const { selectedData, clearSelected } = useController();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Block
        card="full"
        header={
          <Text category="interface" segment="title" type="common" bold>
            <Lsi lsi={{ en: "Attendance management", cs: "Správa docházek" }} />
          </Text>
        }
        actionList={[
          { component: <FilterButton type="bar" /> },
          { component: <SorterButton type="dropdown" /> },
          { divider: true },
          {
            component: pending ? (
              <Pending size="m" />
            ) : (
              <RichIcon icon="uugds-reload" colorScheme="dim" significance="subdued" borderRadius="moderate" />
            ),
            onClick: onRefresh,
          },
        ]}
      >
        <FilterBar />
        <BulkActionBar
          actionList={[
            {
              icon: "uugds-delete",
              colorScheme: "negative",
              onClick: () => onDeleteBulk(selectedData, () => clearSelected()),
            },
          ]}
        />
        <Table columnList={COLUMN_LIST} getActionList={getActionList} verticalAlignment="center" />
        <AutoLoad data={data} handleLoadNext={onLoadNext} distance={window.innerHeight} />
      </Block>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AttendanceTable };
export default AttendanceTable;
//@@viewOff:exports
