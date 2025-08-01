//@@viewOn:imports
import { AutoLoad, createVisualComponent, Lsi, PropTypes } from "uu5g05";
import Config from "./config/config.js";
import { ControllerProvider } from "uu5tilesg02";
import { Badge, Block, DateTime, Link, Pending, RichIcon, Tag, Text } from "uu5g05-elements";
import { Text as FText } from "uu5g05-forms";
import { FilterBar, FilterButton, SorterButton } from "uu5tilesg02-controls";
import { Table } from "uu5tilesg02-elements";
import { PersonItem } from "uu_plus4u5g02-elements";
import TextBox from "./text-box.js";
//@@viewOff:imports

//@@viewOn:constants
const FILTER_LIST = [
  {
    key: "activityId",
    label: { en: "Activity ID", cs: "ID aktivity" },
    inputType: FText.Input,
    inputProps: {
      placeholder: { en: "Enter Activity ID", cs: "Zadejte ID aktivity" },
      pattern: "^[a-fA-F0-9]{24}$",
    },
  },
  {
    key: "uuIdentityName",
    label: { en: "Author", cs: "Autor" },
    inputType: FText.Input,
    inputProps: {
      placeholder: { en: "Enter author's name", cs: "Zadejte jméno autora" },
    },
  },
  {
    key: "uuIdentity",
    label: { en: "Author Plus4U ID", cs: "Plus4U ID autora" },
    inputType: FText.Input,
    inputProps: {
      placeholder: { en: "Enter author's Plus4U ID", cs: "Zadejte Plus4U ID autora" },
      pattern: "^\\d{1,4}(-\\d{1,4}){1,3}$",
    },
  },
  {
    key: "createdAt",
    label: { en: "Creation date", cs: "Datum vytvoření" },
    inputType: "date-range",
    inputProps: {
      placeholder: { en: "Select a date range", cs: "Vyberte datové rozmezí" },
    },
  },
  {
    key: "type",
    label: { en: "Post type", cs: "Typ příspěvku" },
    inputType: "switch-select",
    inputProps: {
      itemList: [
        {
          value: "normal",
          children: (
            <>
              <Badge colorScheme="building" significance="common" size="l" />
              &nbsp; Normal
            </>
          ),
        },
        {
          value: "important",
          children: (
            <>
              <Badge colorScheme="warning" size="l" />
              &nbsp; Important
            </>
          ),
        },
      ],
      placeholder: { en: "Select post type", cs: "Vyberte typ příspěvku" },
    },
  },
];

const SORTER_LIST = [
  {
    key: "createdAt",
    label: { en: "Creation date", cs: "Datum vytvoření" },
  },
];

const COLUMN_LIST = [
  {
    value: "activityId",
    header: <Lsi lsi={{ en: "Activity ID", cs: "ID Aktivity" }} />,
    cell: ({ data }) => (
      <Link
        tooltip={{ en: "Go to activity page", cs: "Přejít na stránku aktivity" }}
        href={`activity?id=${data.activityId}`}
        target="_blank"
      >
        {data.activityId}
      </Link>
    ),
  },
  {
    value: "uuIdentity",
    header: <Lsi lsi={{ en: "Author", cs: "Autor" }} />,
    cell: ({ data }) => (
      <PersonItem uuIdentity={data.uuIdentity} title={data.uuIdentityName} subtitle={data.uuIdentity} />
    ),
  },
  {
    value: "content",
    header: <Lsi lsi={{ en: "Post content", cs: "Obsah příspěvku" }} />,
    cell: ({ data }) => <TextBox previewLength={100} content={data.content} />,
  },
  {
    value: "createdAt",
    header: <Lsi lsi={{ en: "Creation date", cs: "Datum vytvoření" }} />,
    headerComponent: <Table.HeaderCell horizontalAlignment="center" />,
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    cell: ({ data }) => <DateTime value={data.createdAt} timeFormat="long" dateFormat="medium" />,
  },
  {
    value: "type",
    header: <Lsi lsi={{ en: "Type", cs: "Typ" }} />,
    headerComponent: <Table.HeaderCell horizontalAlignment="center" />,
    cellComponent: <Table.Cell horizontalAlignment="center" />,
    cell: ({ data }) => (
      <Tag
        size="m"
        colorScheme={data.type === "normal" ? "neutral" : "warning"}
        style={{ textTransform: "capitalize" }}
      >
        {data.type}
      </Tag>
    ),
    maxWidth: "120px",
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

const PostTable = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "PostTable",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    pending: PropTypes.bool,
    data: PropTypes.array,
    sorterList: PropTypes.array,
    filterList: PropTypes.array,
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
    onSorterListChange: () => {},
    sorterList: [],
    onFilterListChange: () => {},
    filterList: [],
    getActionList: () => {},
    onRefresh: () => {},
    onLoadNext: () => {},
  },
  //@@viewOff:defaultProps

  render({
    data,
    pending,
    onSorterListChange,
    sorterList,
    onFilterListChange,
    filterList,
    onRefresh,
    getActionList,
    onLoadNext,
  }) {
    //@@viewOn:private
    const dataToRender = data
      .filter((item) => item != null)
      .map((item) => ({
        ...item.data,
        handlerMap: item.handlerMap,
      }));
    //@@viewOff:private

    //@@viewOn:render
    return (
      <ControllerProvider
        itemIdentifier="id"
        data={dataToRender}
        filterDefinitionList={FILTER_LIST}
        filterList={filterList}
        onFilterChange={onFilterListChange}
        sorterDefinitionList={SORTER_LIST}
        sorterList={sorterList}
        onSorterChange={onSorterListChange}
        selectable="none"
      >
        <Block
          card="full"
          header={
            <Text category="interface" segment="title" type="common" bold>
              <Lsi lsi={{ en: "Post management", cs: "Správa příspěvků" }} />
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
            verticalAlignment="center"
            columnList={COLUMN_LIST}
            getActionList={getActionList}
            stickyHeader={true}
            displayCellSelection="none"
          />
          <AutoLoad data={data} handleLoadNext={onLoadNext} distance={window.innerHeight} />
        </Block>
      </ControllerProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { PostTable };
export default PostTable;
//@@viewOff:exports
