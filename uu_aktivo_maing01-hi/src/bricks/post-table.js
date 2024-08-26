//@@viewOn:imports
import { AutoLoad, createVisualComponent, Lsi, Utils } from "uu5g05";
import Config from "./config/config.js";
import { ControllerProvider } from "uu5tilesg02";
import { Badge, Block, DateTime, Link, Tag, Text } from "uu5g05-elements";
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
    inputProps: {
      placeholder: { en: "Enter Activity ID", cs: "Zadejte ID aktivity" },
    },
  },
  {
    key: "uuIdentityName",
    label: { en: "Author", cs: "Autor" },
    inputProps: {
      placeholder: { en: "Enter author's name", cs: "Zadejte jméno autora" },
    },
  },
  {
    key: "uuIdentity",
    label: { en: "Author Plus4U ID", cs: "Plus4U ID autora" },
    inputProps: {
      placeholder: { en: "Enter author's Plus4U ID", cs: "Zadejte Plus4U ID autora" },
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
    cell: ({ data }) => <DateTime value={data.createdAt} timeFormat="long" dateFormat="medium" />,
  },
  {
    value: "type",
    header: <Lsi lsi={{ en: "Type", cs: "Typ" }} />,
    cell: ({ data }) => (
      <Tag
        size="m"
        colorScheme={data.type === "normal" ? "neutral" : "warning"}
        style={{ textTransform: "capitalize" }}
      >
        {data.type}
      </Tag>
    ),
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
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    data: [],
    onSorterListChange: () => {},
    sorterList: [],
    onFilterListChange: () => {},
    filterList: [],
    getActionList: [],
    onRefresh: () => {},
  },
  //@@viewOff:defaultProps

  render({
    data,
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
        data={dataToRender}
        filterDefinitionList={FILTER_LIST}
        filterList={filterList}
        onFilterChange={onFilterListChange}
        sorterDefinitionList={SORTER_LIST}
        sorterList={sorterList}
        onSorterChange={onSorterListChange}
      >
        <Block
          card="full"
          header={
            <Text category="interface" segment="title" type="common" bold>
              <Lsi lsi={{ en: "Post management", cs: "Správa příspěvků" }} />
            </Text>
          }
          actionList={[
            { icon: "uugds-refresh", onClick: onRefresh },
            { component: <FilterButton type="bar" /> },
            { component: <SorterButton type="dropdown" /> },
          ]}
        >
          <FilterBar displayManagerButton={false} />
          <Table verticalAlignment="center" columnList={COLUMN_LIST} getActionList={getActionList} />
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
