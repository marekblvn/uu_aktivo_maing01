//@@viewOn:imports
import { AutoLoad, createVisualComponent, Lsi, useCallback, useState } from "uu5g05";
import Config from "./config/config.js";
import { ControllerProvider } from "uu5tilesg02";
import { Block, DateTime, Link, Text } from "uu5g05-elements";
import { FilterBar, FilterButton, SorterBar, SorterButton } from "uu5tilesg02-controls";
import { Table } from "uu5tilesg02-elements";
import { PersonItem } from "uu_plus4u5g02-elements";
//@@viewOff:imports

//@@viewOn:constants
const SORTER_LIST = [
  {
    key: "activityName",
    label: <Lsi lsi={{ en: "Activity name", cs: "Název aktivity" }} />,
    sort: (a, b) => a.activityName.localeCompare(b.activityName),
  },
  {
    key: "createdAt",
    label: <Lsi lsi={{ en: "Created at", cs: "Datum vytvoření" }} />,
    sort: (a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (dateA < dateB) return -1;
      else if (dateA > dateB) return 1;
      return 0;
    },
  },
];

const COLUMN_LIST = [
  {
    value: "activityName",
    header: <Lsi lsi={{ en: "Activity name", cs: "Název aktivity" }} />,
    headerComponent: <Table.HeaderCell filterKey="activityName" />,
    cell: ({ data }) => (
      <Link href={`activity?id=${data.activityId}`} target="_blank">
        {data.activityName}
      </Link>
    ),
  },
  {
    value: "uuIdentity",
    header: <Lsi lsi={{ en: "Recipient", cs: "Příjemce" }} />,
    headerComponent: <Table.HeaderCell filterKey="uuIdentity" />,
    cell: ({ data }) => <PersonItem uuIdentity={data.uuIdentity} subtitle={data.uuIdentity} size="s" />,
  },
  {
    value: "createdAt",
    header: <Lsi lsi={{ en: "Created at", cs: "Datum vytvoření" }} />,
    headerComponent: <Table.HeaderCell filterKey="createdAt" />,
    cell: ({ data }) => <DateTime value={data.createdAt} />,
  },
];

const FILTER_LIST = [
  {
    key: "activityName",
    label: { en: "Activity name", cs: "Název aktivity" },
    filter: (item, value) => {
      let fragments = value.split(/[\s,.-;:_]/);
      return fragments.some((frag) => {
        let itemValue = item.activityName;
        return itemValue.toLowerCase().indexOf(frag.toLowerCase()) !== -1;
      });
    },
    inputProps: { placeholder: { en: "Enter activity name", cs: "Zadejte název aktivity" } },
  },
  {
    key: "uuIdentity",
    label: { en: "Recipient", cs: "Příjemce" },
    filter: (item, value) => {
      let fragments = value.split(/\s+/);
      return fragments.some((frag) => {
        let itemValue = item.uuIdentity;
        return itemValue.toLowerCase().indexOf(frag.toLowerCase()) !== -1;
      });
    },
    inputProps: {
      placeholder: { en: "Enter recipient's Plus4U ID", cs: "Zadejte Plus4U ID příjemce" },
    },
  },
  {
    key: "createdAt",
    label: { en: "Created at", cs: "Datum vytvoření" },
    filter: (item, value) => {
      const itemDate = new Date(item.createdAt);
      let [after, before] = value;
      after = new Date(after);
      before = new Date(before);
      return after <= itemDate && itemDate < before;
    },
    inputType: "date-range",
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

const InvitationTable = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "InvitationTable",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ data, onLoadNext, onRefresh, onDeleteInvitation }) {
    //@@viewOn:private
    const [sorterList, setSorterList] = useState();
    const [filterList, setFilterList] = useState();
    //@@viewOff:private

    const getActionList = useCallback(
      ({ rowIndex, data }) => {
        return [
          {
            icon: "mdi-delete",
            tooltip: { en: "Delete invitation", cs: "Smazat pozvánku" },
            onClick: (e) => onDeleteInvitation(data),
            colorScheme: "negative",
            significance: "subdued",
            order: 1,
          },
        ];
      },
      [data],
    );

    //@@viewOn:render
    return (
      <ControllerProvider
        sorterList={sorterList}
        sorterDefinitionList={SORTER_LIST}
        onSorterChange={(e) => setSorterList(e.data.sorterList)}
        filterList={filterList}
        filterDefinitionList={FILTER_LIST}
        onFilterChange={(e) => setFilterList(e.data.filterList)}
        itemIdentifier="id"
        selectable="none"
        data={data}
      >
        <Block
          card="full"
          header={
            <Text category="interface" segment="title" type="common" bold>
              <Lsi lsi={{ en: "Invitation management", cs: "Správa pozvánek" }} />
            </Text>
          }
          actionList={[
            { component: <SorterButton type="bar" /> },
            { component: <FilterButton type="bar" /> },
            { divider: true },
            {
              icon: "mdi-refresh",
              tooltip: { en: "Refresh", cs: "Obnovit" },
              onClick: onRefresh,
              colorScheme: "dim",
              significance: "subdued",
              order: 1,
            },
          ]}
        >
          <SorterBar displayManagerButton={false} />
          <FilterBar displayManagerButton={false} />
          <Table
            columnList={COLUMN_LIST}
            verticalAlignment="center"
            displayCellSelection="none"
            stickyHeader={true}
            getActionList={getActionList}
          />
          <AutoLoad data={data} handleLoadNext={onLoadNext} distance={window.innerHeight} />
        </Block>
      </ControllerProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { InvitationTable };
export default InvitationTable;
//@@viewOff:exports
