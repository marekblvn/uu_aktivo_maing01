//@@viewOn:imports
import { AutoLoad, createVisualComponent, Lsi, Utils } from "uu5g05";
import Config from "./config/config.js";
import { ControllerProvider } from "uu5tilesg02";
import { Table } from "uu5tilesg02-elements";
import { FilterButton, FilterBar, SorterButton } from "uu5tilesg02-controls";
import { PersonItem } from "uu_plus4u5g02-elements";
import { Block, Button, Icon, Link, Pending, RichIcon, Text, TouchLink } from "uu5g05-elements";
import { TextSelect } from "uu5g05-forms";
import TextBox from "./text-box.js";
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
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    cell: ({ data }) => (
      <RichIcon
        disabled={data.datetimeId === null}
        icon="uugds-calendar"
        colorScheme={data.datetimeId === null ? "cancelled" : "steel"}
        significance="subdued"
        borderRadius="moderate"
        tooltip={{ en: "Go to datetime detail", cs: "Přejít na detail termínu" }}
      />
    ),
    maxWidth: "100px",
  },
  {
    value: "recurrent",
    header: <Lsi lsi={{ en: "Recurrent", cs: "Opakující se" }} />,
    headerComponent: <Table.HeaderCell horizontalAlignment="center" />,
    maxWidth: "100px",
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    cell: ({ data }) => <Icon icon={data.recurrent ? "mdi-check" : "mdi-close"} />,
  },
];

const FILTER_LIST = [
  {
    key: "name",
    label: { en: "Name", cs: "Název" },
    inputProps: { placeholder: { en: "Enter name", cs: "Zadejte název" } },
  },
  {
    key: "owner",
    label: { en: "Owner", cs: "Vlastník" },
    inputProps: { placeholder: { en: "Enter owner's Plus4U ID", cs: "Zadejte Plus4U ID vlastníka" } },
  },
  {
    key: "members",
    label: { en: "Members", cs: "Členové" },
    inputType: TextSelect.Input,
    inputProps: {
      insertable: true,
      multiple: true,
      itemList: [],
      value: [],
    },
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
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
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
