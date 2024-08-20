//@@viewOn:imports
import { createVisualComponent, Lsi, useLsi, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Button, Grid, ListLayout, PlaceholderBox, Text } from "uu5g05-elements";
import { Checkbox } from "uu5g05-forms";
import importLsi from "../lsi/import-lsi.js";
import { useAuthorization } from "../contexts/authorization-context.js";
import { useActivityAuthorization } from "../contexts/activity-authorization-context.js";
import { getIndexByValues, FREQUENCY_LSI } from "../../utils/frequency-utils.js";
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
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
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

    const frequencyOptionIndex = getIndexByValues(frequency);

    const formattedNotificationOffsetCs = (() => {
      if (!notificationOffset) return "";
      const { days, hours, minutes } = notificationOffset;
      const daysString =
        days === 0 ? "" : days === 1 ? "1 den" : [2, 3, 4].includes(days) ? `${days} dny` : `${days} dní`;
      const hoursString =
        hours === 0 ? "" : hours === 1 ? "1 hodina" : [2, 3, 4].includes(hours) ? `${hours} hodiny` : `${hours} hodin`;
      const minutesString = minutes === 0 ? "" : `${minutes} minut`;
      const timeString = [hoursString, minutesString].filter((i) => i !== "").join(" a ");
      return `${daysString}${days > 0 && timeString !== "" ? ", " : ""}${timeString}`;
    })();

    const formattedNotificationOffsetEn = (() => {
      if (!notificationOffset) return "";
      const { days, hours, minutes } = notificationOffset;
      const daysString = days === 0 ? "" : days === 1 ? "1 day" : `${days} days`;
      const hoursString = hours === 0 ? "" : hours === 1 ? "1 hour" : `${hours} hours`;
      const minutesString = minutes === 0 ? "" : `${minutes} minutes`;
      const timeString = [hoursString, minutesString].filter((i) => i !== "").join(" and ");
      return `${daysString}${days > 0 && timeString !== "" ? ", " : ""}${timeString}`;
    })();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Grid rowGap={{ xs: 2, l: 16 }}>
        <div>
          <Text category="interface" segment="title" type={["xl", "l", "m"].includes(screenSize) ? "minor" : "micro"}>
            <Lsi lsi={{ en: "Datetime settings", cs: "Nastavení termínu" }} />
          </Text>
        </div>

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
                children: <Checkbox value={recurrent} readOnly box={false} borderRadius="full" colorScheme="red" />,
              },
              {
                label: { en: "Datetime recurrence frequency", cs: "Frekvence opakování termínu" },
                children: <Lsi lsi={FREQUENCY_LSI[frequencyOptionIndex]} />,
                actionList: canEditAndDelete
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
                children: <Lsi lsi={{ en: formattedNotificationOffsetEn, cs: formattedNotificationOffsetCs }} />,
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
