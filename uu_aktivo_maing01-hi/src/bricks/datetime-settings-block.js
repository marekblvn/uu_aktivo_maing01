//@@viewOn:imports
import { createVisualComponent, Lsi, PropTypes, useLsi, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Button, Grid, ListLayout, PlaceholderBox, RichIcon, Text } from "uu5g05-elements";
import importLsi from "../lsi/import-lsi.js";
import { useAuthorization } from "../contexts/authorization-context.js";
import { useActivityAuthorization } from "../contexts/activity-authorization-context.js";
import { getIndexByValues, FREQUENCY_LSI } from "../../utils/frequency-utils.js";
import { notificationOffsetToLsi } from "../../utils/notification-offset-utils.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: (props) => Config.Css.css({}),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const DatetimeSettingsBlock = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DatetimeSettingsBlock",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    datetimeId: PropTypes.string,
    recurrent: PropTypes.bool,
    frequency: PropTypes.object,
    notificationOffset: PropTypes.object,
    onEditFrequency: PropTypes.func,
    onEditNotificationOffset: PropTypes.func,
    onDeleteDatetime: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    datetimeId: null,
    recurrent: false,
    frequency: {},
    notificationOffset: {},
    onEditFrequency: () => {},
    onEditNotificationOffset: () => {},
    onDeleteDatetime: () => {},
  },
  //@@viewOff:defaultProps

  render({
    datetimeId,
    recurrent,
    frequency,
    notificationOffset,
    onEditFrequency,
    onEditNotificationOffset,
    onChangeRecurrence,
    onDeleteDatetime,
  }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const placeholderLsi = useLsi({ import: importLsi, path: ["Placeholder", "noDatetime"] });
    const { isAuthority, isExecutive } = useAuthorization();
    const { isOwner } = useActivityAuthorization();

    const canEditAndDelete = isAuthority || isExecutive || isOwner;

    const optionIndex = getIndexByValues(frequency);
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Grid rowGap={{ xs: 2, l: 16 }}>
        <Text category="interface" segment="title" type={["xl", "l", "m"].includes(screenSize) ? "minor" : "micro"}>
          <Lsi lsi={{ en: "Datetime settings", cs: "Nastavení termínu" }} />
        </Text>

        {datetimeId === null ? (
          <PlaceholderBox
            code="calendar"
            header={placeholderLsi.header}
            info={{ en: "Datetime settings cannot be changed", cs: "Nelze měnit nastavení termínu" }}
            style={{ padding: "12px" }}
            size={["xl", "l"].includes(screenSize) ? "m" : "s"}
          />
        ) : (
          <ListLayout
            itemList={[
              {
                label: { en: "Recurrent datetime", cs: "Opakující se termín" },
                children: (
                  <RichIcon
                    icon={recurrent ? "mdi-check-circle-outline" : "mdi-close-circle-outline"}
                    colorScheme={recurrent ? "positive" : "negative"}
                    significance="subdued"
                    size="m"
                    borderRadius="none"
                  />
                ),
              },
              {
                label: { en: "Datetime recurrence frequency", cs: "Frekvence opakování termínu" },
                children: Object.keys(frequency).length > 0 ? <Lsi lsi={FREQUENCY_LSI[optionIndex]} /> : "—",
                actionList:
                  canEditAndDelete && recurrent
                    ? [
                        {
                          icon: "mdi-pencil",
                          onClick: onEditFrequency,
                        },
                      ]
                    : null,
              },
              {
                label: { en: "Datetime notification offset", cs: "Posun oznámení termínu" },
                info: {
                  en: "How many days, hours, minutes before the datetime deadline will the notification be sent",
                  cs: "Kolik dní, hodin, minut před datem termínu bude posláno upozornění",
                },
                children: <Lsi lsi={notificationOffsetToLsi(notificationOffset)} />,
                actionList: canEditAndDelete
                  ? [
                      {
                        icon: "mdi-pencil",
                        onClick: onEditNotificationOffset,
                      },
                    ]
                  : null,
              },
            ]}
            collapsibleItemList={
              canEditAndDelete
                ? [
                    {
                      label: { en: "Delete datetime", cs: "Smazat termín" },
                      children: (
                        <Button
                          colorScheme="negative"
                          significance="distinct"
                          style={{ margin: "8px 0" }}
                          onClick={onDeleteDatetime}
                        >
                          <Lsi lsi={{ en: "Delete datetime", cs: "Smazat termín" }} />
                        </Button>
                      ),
                    },
                  ]
                : null
            }
          />
        )}
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DatetimeSettingsBlock };
export default DatetimeSettingsBlock;
//@@viewOff:exports
