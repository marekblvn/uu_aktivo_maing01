//@@viewOn:imports
import { AutoLoad, createVisualComponent, Lsi, useCallback, useState } from "uu5g05";
import Config from "./config/config.js";
import { ControllerProvider } from "uu5tilesg02";
import { Table } from "uu5tilesg02-elements";
import { FilterManagerModal, FilterButton, FilterBar } from "uu5tilesg02-controls";
import { PersonItem } from "uu_plus4u5g02-elements";
import { Block, Icon, RichIcon, Text } from "uu5g05-elements";
import { FREQUENCY_LSI, getIndexByValues } from "../../utils/frequency-utils.js";
import { notificationOffsetToLsi } from "../../utils/notification-offset-utils.js";
//@@viewOff:imports

//@@viewOn:constants
const SORTER_LIST = [
  {
    key: "name",
    label: <Lsi lsi={{ en: "Name", cs: "Název" }} />,
    sort: (a, b) => a.name.localeCompare(b.name),
  },
  {
    key: "location",
    label: <Lsi lsi={{ en: "Location", cs: "Lokace" }} />,
    sort: (a, b) => a.location.localeCompare(b.location),
  },
  {
    key: "members",
    label: <Lsi lsi={{ en: "No. of members", cs: "Poč. členů" }} />,
    sort: (a, b) => a.members - b.members,
  },
];

const COLUMN_LIST = [
  {
    value: "id",
    maxWidth: "68px",
    cell: ({ data }) => (
      <RichIcon
        icon="mdi-open-in-new"
        tooltip={{ en: "Go to activity page", cs: "Přejít na stránku aktivity" }}
        colorScheme="neutral"
        significance="subdued"
        borderRadius="moderate"
        onClick={() => data.onClickGoToActivity(data.id)}
      />
    ),
  },
  {
    value: "name",
    header: <Lsi lsi={{ en: "Name", cs: "Název" }} />,
    headerComponent: <Table.HeaderCell sorterKey="name" filterKey="name" />,
  },
  {
    value: "owner",
    header: <Lsi lsi={{ en: "Owner", cs: "Vlastník" }} />,
    headerComponent: <Table.HeaderCell filterKey="owner" />,
    cell: ({ data }) => <PersonItem uuIdentity={data.owner} size="s" />,
  },
  {
    value: "members",
    header: <Lsi lsi={{ en: "No. of members", cs: "Poč. členů" }} />,
    headerComponent: <Table.HeaderCell sorterKey="members" horizontalAlignment="center" />,
    maxWidth: "100px",
    cellComponent: <Table.Cell horizontalAlignment="center" />,
  },
  {
    value: "location",
    header: <Lsi lsi={{ en: "Location", cs: "Lokace" }} />,
    headerComponent: <Table.HeaderCell sorterKey="location" filterKey="location" />,
  },
  {
    value: "description",
    header: <Lsi lsi={{ en: "Description", cs: "Popis" }} />,
    cell: ({ data }) => (
      <Text autoFit style={{ maxHeight: "100px" }}>
        {data.description}
      </Text>
    ),
  },
  {
    value: "datetimeId",
    header: <Lsi lsi={{ en: "Datetime", cs: "Termín" }} />,
    headerComponent: <Table.HeaderCell horizontalAlignment="center" />,
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    cell: ({ data }) => (
      <RichIcon
        disabled={data.datetimeId === null}
        icon="mdi-calendar-cursor"
        colorScheme={data.datetimeId === null ? "cancelled" : "steel"}
        significance="subdued"
        borderRadius="moderate"
        tooltip={{ en: "Go to datetime detail", cs: "Přejít na detail termínu" }}
        onClick={() => data.onClickDatetime(data.datetimeId, data)}
      />
    ),
    maxWidth: "100px",
  },
  {
    value: "recurrent",
    header: <Lsi lsi={{ en: "Recurrent", cs: "Opakující se" }} />,
    headerComponent: <Table.HeaderCell filterKey="recurrent" horizontalAlignment="center" />,
    maxWidth: "100px",
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    cell: ({ data }) => <Icon icon={data.recurrent ? "mdi-check" : "mdi-close"} />,
  },
  {
    value: "frequency",
    header: <Lsi lsi={{ en: "Frequency", cs: "Frekvence" }} />,
    headerComponent: <Table.HeaderCell horizontalAlignment="center" />,
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    cell: ({ data }) => <Lsi lsi={FREQUENCY_LSI[getIndexByValues(data.frequency)]} />,
  },
  {
    value: "notificationOffset",
    header: <Lsi lsi={{ en: "Notification offset", cs: "Posun upozornění" }} />,
    headerComponent: <Table.HeaderCell horizontalAlignment="center" />,
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    cell: ({ data }) => <Lsi lsi={notificationOffsetToLsi(data.notificationOffset)} />,
  },
];

const FILTER_LIST = [
  {
    key: "name",
    label: { en: "Name", cs: "Název" },
    filter: (item, value) => {
      let fragments = value.split(/[\s,.-;:_]/);
      return fragments.some((frag) => {
        let itemValue = item.name;
        return itemValue.toLowerCase().indexOf(frag.toLowerCase()) !== -1;
      });
    },
    inputProps: { placeholder: { en: "Enter name", cs: "Zadejte název" } },
  },
  {
    key: "owner",
    label: { en: "Owner", cs: "Vlastník" },
    filter: (item, value) => {
      let fragments = value.split(/\s+/);
      return fragments.some((frag) => {
        let itemValue = item.owner;
        return itemValue.toLowerCase().indexOf(frag.toLowerCase()) !== -1;
      });
    },
    inputProps: { placeholder: { en: "Enter owner's Plus4U ID", cs: "Zadejte Plus4U ID vlastníka" } },
  },
  {
    key: "location",
    label: { en: "Location", cs: "Lokace" },
    filter: (item, value) => {
      let fragments = value.split(/[\s,.-;:_]/);
      return fragments.some((frag) => {
        let itemValue = item.location;
        return itemValue.toLowerCase().indexOf(frag.toLowerCase()) !== -1;
      });
    },
    inputProps: { placeholder: { en: "Enter location", cs: "Zadejte lokaci" } },
  },
  {
    key: "recurrent",
    label: { en: "Recurrent", cs: "Opakující se" },
    inputType: "switch-select",
    inputProps: {
      value: null,
      itemList: [
        { value: "true", children: { en: "Yes", cs: "Ano" }, icon: "mdi-check" },
        { value: "false", children: { en: "No", cs: "Ne" }, icon: "mdi-close" },
      ],
    },
    filter: (item, value) => {
      if (value === null) return true;
      const boolValue = value === "true";
      return item.recurrent === boolValue;
    },
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

const ActivityList = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ data, onLoadNext, onDeleteActivity }) {
    //@@viewOn:private
    const [sorterList, setSorterList] = useState();
    const [filterList, setFilterList] = useState();
    //@@viewOff:private

    const getActionList = useCallback(
      ({ rowIndex, data }) => {
        return [
          {
            icon: "mdi-delete",
            tooltip: { en: "Delete activity", cs: "Smazat aktivitu" },
            onClick: (e) => onDeleteActivity(data),
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
        data={data}
        onSorterChange={(e) => setSorterList(e.data.sorterList)}
        itemIdentifier="id"
        selectable="none"
        filterDefinitionList={FILTER_LIST}
        filterList={filterList}
        onFilterChange={(e) => setFilterList(e.data.filterList)}
      >
        <Block
          card="full"
          header={
            <Text category="interface" segment="title" type="common" bold>
              <Lsi lsi={{ en: "Activity management", cs: "Správa aktivit" }} />
            </Text>
          }
          actionList={[{ component: <FilterButton type="bar" /> }]}
        >
          <FilterBar />
          <FilterManagerModal />
          <Table
            columnList={COLUMN_LIST}
            verticalAlignment="center"
            displayCellSelection="none"
            getActionList={getActionList}
            stickyHeader={true}
          />
          <AutoLoad data={data} handleLoadNext={onLoadNext} distance={window.innerHeight} />
        </Block>
      </ControllerProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityList };
export default ActivityList;
//@@viewOff:exports
