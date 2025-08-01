//@@viewOn:imports
import { AutoLoad, createVisualComponent, Environment, Lsi, PropTypes } from "uu5g05";
import Config from "./config/config.js";
import { ControllerProvider } from "uu5tilesg02";
import { Block, DateTime, Link, Pending, RichIcon, Text } from "uu5g05-elements";
import { Text as FText } from "uu5g05-forms";
import { FilterBar, FilterButton, SorterButton } from "uu5tilesg02-controls";
import { Table } from "uu5tilesg02-elements";
import { PersonItem } from "uu_plus4u5g02-elements";
import { PersonalCard } from "uu_plus4upeopleg01-forms";
//@@viewOff:imports

//@@viewOn:constants
const SORTER_LIST = [
  {
    key: "activityName",
    label: { en: "Activity name", cs: "Název aktivity" },
    sort: (a, b) => a.activityName.localeCompare(b.activityName),
  },
  {
    key: "createdAt",
    label: { en: "Created at", cs: "Datum vytvoření" },
  },
];

const COLUMN_LIST = [
  {
    value: "activityId",
    header: <Lsi lsi={{ en: "Activity ID", cs: "ID aktivity" }} />,
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
    value: "activityName",
    header: <Lsi lsi={{ en: "Activity name", cs: "Název aktivity" }} />,
  },
  {
    value: "uuIdentity",
    header: <Lsi lsi={{ en: "Recipient", cs: "Příjemce" }} />,
    cell: ({ data }) => <PersonItem uuIdentity={data.uuIdentity} subtitle={data.uuIdentity} size="s" />,
  },
  {
    value: "createdAt",
    header: <Lsi lsi={{ en: "Created at", cs: "Datum vytvoření" }} />,
    cell: ({ data }) => <DateTime value={data.createdAt} />,
  },
];

const FILTER_LIST = [
  {
    key: "activityId",
    label: { en: "Activity ID", cs: "ID aktivity" },
    inputType: FText.Input,
    inputProps: { placeholder: { en: "Enter Activity ID", cs: "Zadejte ID aktivity" }, pattern: "^[a-fA-F0-9]{24}$" },
  },
  {
    key: "uuIdentity",
    label: { en: "Recipient", cs: "Příjemce" },
    inputType: PersonalCard.FormSelect,
    inputProps: {
      baseUri: Environment.get("uu_plus4u5g02_peopleBaseUri"),
    },
    valueFormatter: (value) => value.value.name,
  },
  {
    key: "createdAt",
    label: { en: "Created at", cs: "Datum vytvoření" },
    inputType: "date-range",
    inputProps: {
      placeholder: { en: "Select a date range", cs: "Vyberte datové rozmezí" },
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

const InvitationTable = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "InvitationTable",
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
    onLoadNext: () => {},
    onRefresh: () => {},
    getActionList: () => {},
    sorterList: [],
    filterList: [],
    onSorterListChange: () => {},
    onFilterListChange: () => {},
  },
  //@@viewOff:defaultProps

  render({
    data,
    pending,
    onLoadNext,
    onRefresh,
    getActionList,
    sorterList,
    filterList,
    onSorterListChange,
    onFilterListChange,
  }) {
    //@@viewOn:private
    const dataToRender = data
      .filter((item) => item != null)
      .map((item) => ({ ...item.data, handlerMap: item.handlerMap }));
    //@@viewOff:private

    //@@viewOn:render
    return (
      <ControllerProvider
        sorterList={sorterList}
        sorterDefinitionList={SORTER_LIST}
        onSorterChange={onSorterListChange}
        filterList={filterList}
        filterDefinitionList={FILTER_LIST}
        onFilterChange={onFilterListChange}
        selectable="none"
        data={dataToRender}
      >
        <Block
          card="full"
          header={
            <Text category="interface" segment="title" type="common" bold>
              <Lsi lsi={{ en: "Invitation management", cs: "Správa pozvánek" }} />
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
