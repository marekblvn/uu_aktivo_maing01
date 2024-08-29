//@@viewOn:imports
import { AutoLoad, createVisualComponent, Lsi, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Block, DateTime, Number, Pending, RichIcon } from "uu5g05-elements";
import { List } from "uu5tilesg02-elements";
import { BulkActionBar, FilterBar, FilterButton, FilterManagerModal, SorterButton } from "uu5tilesg02-controls";
import { useController } from "uu5tilesg02";
//@@viewOff:imports

//@@viewOn:constants
const COLUMN_LIST = [
  {
    value: "datetime",
    header: <Lsi lsi={{ en: "Datetime date", cs: "Datum termínu" }} />,
    cell: ({ data }) => <DateTime value={data.datetime} timeFormat="medium" dateFormat="long" />,
  },
  {
    value: "confirmed",
    header: <Lsi lsi={{ en: "Confirmed", cs: "Potvrdilo" }} />,
    headerComponent: <List.HeaderCell horizontalAlignment="center" />,
    cell: ({ data }) => <Number value={data.confirmed.length} />,
    cellComponent: <List.Cell horizontalAlignment="center" />,
    maxWidth: "108px",
  },
  {
    value: "undecided",
    header: <Lsi lsi={{ en: "Undecided", cs: "Nerozhodlo se" }} />,
    headerComponent: <List.HeaderCell horizontalAlignment="center" />,
    cell: ({ data }) => <Number value={data.undecided.length} />,
    cellComponent: <List.Cell horizontalAlignment="center" />,
    maxWidth: "140px",
  },
  {
    value: "denied",
    header: <Lsi lsi={{ en: "Denied", cs: "Odmítlo" }} />,
    headerComponent: <List.HeaderCell horizontalAlignment="center" />,
    cell: ({ data }) => <Number value={data.denied.length} />,
    cellComponent: <List.Cell horizontalAlignment="center" />,
    maxWidth: "100px",
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
  defaultProps: {
    data: [],
    pending: false,
  },
  //@@viewOff:defaultProps

  render({ data, pending, getActionList, onDeleteBulk, onLoadNext, onRefresh, children }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { selectedData, clearSelected } = useController();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Block
        card="full"
        actionList={[
          { component: <FilterButton type={["xs", "s"].includes(screenSize) ? "manager" : "bar"} /> },
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
        <FilterManagerModal />
        <BulkActionBar
          actionList={[
            {
              icon: "uugds-delete",
              colorScheme: "negative",
              onClick: () => onDeleteBulk(selectedData, () => clearSelected()),
            },
          ]}
        />
        <List columnList={COLUMN_LIST} getActionList={getActionList} verticalAlignment="center">
          {children}
        </List>
        <AutoLoad data={data} handleLoadNext={onLoadNext} distance={window.innerHeight} />
      </Block>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AttendanceList };
export default AttendanceList;
//@@viewOff:exports
