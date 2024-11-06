//@@viewOn:imports
import { AutoLoad, createVisualComponent, Environment, Lsi, PropTypes, Utils } from "uu5g05";
import Config from "./config/config.js";
import { ControllerProvider } from "uu5tilesg02";
import { Table } from "uu5tilesg02-elements";
import { FilterButton, FilterBar, SorterButton } from "uu5tilesg02-controls";
import { PersonItem } from "uu_plus4u5g02-elements";
import { Block, Button, Icon, Link, Pending, RichIcon, Tag, Text, TouchLink } from "uu5g05-elements";
import { Text as FText } from "uu5g05-forms";
import TextBox from "./text-box.js";
import { PersonalCard } from "uu_plus4upeopleg01-forms";
//@@viewOff:imports

//@@viewOn:constants
const SORTER_LIST = [
  {
    key: "name",
    label: <Lsi lsi={{ en: "Name", cs: "Název" }} />,
  },
  {
    key: "createdAt",
    label: <Lsi lsi={{ en: "Creation date", cs: "Datum vytvoření" }} />,
  },
];

const COLUMN_LIST = [
  {
    value: "id",
    header: "ID",
    headerComponent: <Table.HeaderCell horizontalAlignment="center" />,
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    cell: ({ data }) => (
      <Button
        icon="uugds-copy"
        onClick={() => Utils.Clipboard.write(data.id)}
        tooltip={{ en: "Copy activity ID to clipboard", cs: "Zkopírovat ID aktivity" }}
        colorScheme="dim"
        significance="subdued"
      />
    ),
    maxWidth: "68px",
  },
  {
    value: "name",
    header: <Lsi lsi={{ en: "Name", cs: "Název" }} />,
    headerComponent: <Table.HeaderCell />,
    cell: ({ data }) => (
      <Link href={`activity?id=${data.id}&tab=information`} target="_blank">
        {data.name}
      </Link>
    ),
  },
  {
    value: "owner",
    header: <Lsi lsi={{ en: "Owner", cs: "Vlastník" }} />,
    headerComponent: <Table.HeaderCell />,
    cell: ({ data }) => <PersonItem uuIdentity={data.owner} subtitle={data.owner} />,
  },
  {
    value: "members",
    header: <Lsi lsi={{ en: "Members", cs: "Členové" }} />,
    headerComponent: <Table.HeaderCell horizontalAlignment="center" />,
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    minHeight: "200px",
    cell: ({ data }) => (
      <TouchLink
        href={`activity?id=${data.id}&tab=members`}
        target="_blank"
        icon="uugds-account-multi"
        size="s"
        colorScheme="dim"
        significance="subdued"
      />
    ),
    maxWidth: "100px",
  },
  {
    value: "location",
    header: <Lsi lsi={{ en: "Location", cs: "Lokace" }} />,
    headerComponent: <Table.HeaderCell />,
  },
  {
    value: "description",
    header: <Lsi lsi={{ en: "Description", cs: "Popis" }} />,
    cell: ({ data }) => <TextBox content={data.description} previewLength={80} />,
  },
  {
    value: "datetimeId",
    header: <Lsi lsi={{ en: "Datetime", cs: "Termín" }} />,
    headerComponent: <Table.HeaderCell horizontalAlignment="center" />,
    cell: ({ data }) => (
      <Tag
        colorScheme={data.datetimeId === null ? "cancelled" : "active"}
        significance="highlighted"
        size="xs"
        tooltip={
          data.datetimeId === null
            ? { en: "Does not have datetime", cs: "Nemá termín" }
            : { en: "Has a datetime", cs: "Má termín" }
        }
      >
        &nbsp;
      </Tag>
    ),
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    maxWidth: "100px",
  },
  {
    value: "recurrent",
    header: <Lsi lsi={{ en: "Recurrent", cs: "Opakující se" }} />,
    headerComponent: <Table.HeaderCell horizontalAlignment="center" />,
    maxWidth: "100px",
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    cell: ({ data }) => <Icon icon={data.recurrent ? "uugds-check" : "uugds-close"} />,
  },
];

const FILTER_LIST = [
  {
    key: "id",
    label: { en: "Activity ID", cs: "ID aktivity" },
    inputType: FText.Input,
    inputProps: {
      placeholder: { en: "Enter Activity ID", cs: "Zadejte ID aktivity" },
      pattern: "^[a-fA-F0-9]{24}$",
    },
  },
  {
    key: "name",
    label: { en: "Name", cs: "Název" },
    inputProps: { placeholder: { en: "Enter name", cs: "Zadejte název" } },
  },
  {
    key: "owner",
    label: { en: "Owner", cs: "Vlastník" },
    inputType: PersonalCard.FormSelect,
    inputProps: {
      baseUri: Environment.get("uu_plus4u5g02_peopleBaseUri"),
    },
    valueFormatter: (value) => value.value.name,
  },
  {
    key: "members",
    label: { en: "Members", cs: "Členové" },
    inputType: PersonalCard.FormSelect,
    inputProps: {
      multiple: true,
      baseUri: Environment.get("uu_plus4u5g02_peopleBaseUri"),
    },
  },
  {
    key: "hasDatetime",
    label: { en: "Has datetime", cs: "Má termín" },
    inputType: "switch-select",
    inputProps: {
      value: null,
      itemList: [
        { value: "true", children: { en: "Yes", cs: "Ano" }, icon: "uugds-check" },
        { value: "false", children: { en: "No", cs: "Ne" }, icon: "uugds-close" },
      ],
    },
  },
  {
    key: "recurrent",
    label: { en: "Recurrent", cs: "Opakující se" },
    inputType: "switch-select",
    inputProps: {
      value: null,
      itemList: [
        { value: "true", children: { en: "Yes", cs: "Ano" }, icon: "uugds-check" },
        { value: "false", children: { en: "No", cs: "Ne" }, icon: "uugds-close" },
      ],
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

const ActivityTable = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityTable",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    pending: PropTypes.bool,
    data: PropTypes.array,
    filterList: PropTypes.array,
    sorterList: PropTypes.array,
    onSorterListChange: PropTypes.func,
    onFilterListChange: PropTypes.func,
    getActionList: PropTypes.func,
    onRefresh: PropTypes.func,
    onLoadNext: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    pending: false,
    data: [],
    filterList: [],
    sorterList: [],
    onFilterListChange: () => {},
    onSorterListChange: () => {},
    getActionList: () => {},
    onRefresh: () => {},
    onLoadNext: () => {},
  },
  //@@viewOff:defaultProps

  render({
    data,
    pending,
    getActionList,
    filterList,
    sorterList,
    onFilterListChange,
    onSorterListChange,
    onRefresh,
    onLoadNext,
  }) {
    //@@viewOn:private
    const dataToRender = data
      .filter((item) => item != null)
      .map((item) => ({ ...item.data, handlerMap: item.handlerMap }));
    //@@viewOff:private

    //@@viewOn:render
    return (
      <ControllerProvider
        data={dataToRender}
        itemIdentifier="id"
        sorterList={sorterList}
        sorterDefinitionList={SORTER_LIST}
        onSorterChange={onSorterListChange}
        filterList={filterList}
        onFilterChange={onFilterListChange}
        filterDefinitionList={FILTER_LIST}
        selectable="none"
      >
        <Block
          card="full"
          header={
            <Text category="interface" segment="title" type="common" bold>
              <Lsi lsi={{ en: "Activity management", cs: "Správa aktivit" }} />
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
          <FilterBar displayManagerButton={false} />
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
export { ActivityTable };
export default ActivityTable;
//@@viewOff:exports
