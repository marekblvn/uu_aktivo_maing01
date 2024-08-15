//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Block, Grid, PlaceholderBox, RichIcon, Text } from "uu5g05-elements";
import { Checkbox } from "uu5g05-forms";
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
  }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();

    const formattedFrequencyCs = (() => {
      if (!frequency) return "";
      const { months, days } = frequency;
      const monthsString =
        months === 0
          ? ""
          : months === 1
            ? "1 měsíc"
            : [2, 3, 4].includes(months)
              ? `${months} měsíce`
              : `${months} měsíců`;
      const daysString =
        days === 0 ? "" : days === 1 ? "1 den" : [2, 3, 4].includes(days) ? `${days} dny` : `${days} dní`;
      return [monthsString, daysString].filter((i) => i !== "").join(" a ");
    })();

    const formattedFrequencyEn = (() => {
      if (!frequency) return "";
      const { months, days } = frequency;
      const monthsString = months === 0 ? "" : months === 1 ? "1 month" : `${months} months`;
      const daysString = days === 0 ? "" : days === 1 ? "1 day" : `${days} days`;
      return [monthsString, daysString].filter((i) => i !== "").join(" and ");
    })();

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
      <Block
        card="full"
        header={
          <Text category="interface" segment="title" type={["xs", "s"].includes(screenSize) ? "micro" : "minor"}>
            <Lsi lsi={{ en: "Date settings", cs: "Nastavení data" }} />
          </Text>
        }
        headerType="title"
      >
        {datetimeId !== null ? (
          ({ style }) => (
            <Grid
              style={style}
              columnGap="8px"
              templateColumns={{ xs: "100%" }}
              templateRows={{ xs: "repeat(2, auto)" }}
              alignItems="center"
            >
              {recurrent && (
                <div style={{ display: "flex", alignItems: "center", columnGap: "6px" }}>
                  <Text
                    category="interface"
                    segment="content"
                    type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                    bold
                  >
                    <Lsi lsi={{ en: "Periodically create next date", cs: "Pravidelně vytvářet následující datum" }} />
                  </Text>
                  <Checkbox
                    info={{
                      en: "Should a new date be created from the existing one after its end using frequency?",
                      cs: "Má se z existujícího data po jeho konci vytvořit nové pomocí frekvence?",
                    }}
                    value={recurrent}
                    box={false}
                    onChange={onChangeRecurrence}
                    size="xxs"
                    disabled={true} // TODO: Remove this line when uuCmd activity/stopRecurrence is implemented
                  />
                </div>
              )}
              <Grid
                templateColumns={{ xs: "100%" }}
                templateRows={{ xs: "repeat(2, auto)" }}
                justifyContent={{ xs: "start", l: "end" }}
              >
                {frequency && recurrent && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      maxWidth: ["xs"].includes(screenSize) ? "500px" : "400px",
                    }}
                  >
                    <div
                      style={{
                        display: ["xs", "s"].includes(screenSize) ? "grid" : "flex",
                        columnGap: "4px",
                        rowGap: "4px",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        category="interface"
                        segment="content"
                        type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                        bold
                      >
                        <Lsi lsi={{ en: "Frequency", cs: "Frekvence" }} />
                      </Text>
                      {["xs", "s"].includes(screenSize) || "—"}
                      <Text
                        category="interface"
                        segment="content"
                        type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                      >
                        <Lsi lsi={{ en: formattedFrequencyEn, cs: formattedFrequencyCs }} />
                      </Text>
                    </div>
                    <RichIcon
                      icon="mdi-pencil"
                      size="xs"
                      borderRadius="expressive"
                      style={{ marginLeft: "auto" }}
                      onClick={onEditFrequency}
                    />
                  </div>
                )}
                {notificationOffset && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      maxWidth: "xs" === screenSize ? "500px" : "400px",
                    }}
                  >
                    <div
                      style={{
                        display: ["xs", "s"].includes(screenSize) ? "grid" : "flex",
                        columnGap: "4px",
                        rowGap: "4px",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        category="interface"
                        segment="content"
                        type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                        bold
                      >
                        <Lsi lsi={{ en: "Notification Offset", cs: "Posun oznámení" }} />
                      </Text>
                      {["xs", "s"].includes(screenSize) || "—"}
                      <Text
                        category="interface"
                        segment="content"
                        type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                      >
                        <Lsi lsi={{ en: formattedNotificationOffsetEn, cs: formattedNotificationOffsetCs }} />
                      </Text>
                    </div>
                    <RichIcon
                      icon="mdi-pencil"
                      size="xs"
                      borderRadius="expressive"
                      style={{ marginLeft: "auto" }}
                      onClick={onEditNotificationOffset}
                    />
                  </div>
                )}
              </Grid>
            </Grid>
          )
        ) : (
          <PlaceholderBox
            code="calendar"
            header={{ en: "Activity does not have an upcoming date", cs: "Aktivita nemá probíhající datum" }}
            info={{ en: "The settings cannot be changed.", cs: "Nelze změnit nastavení data." }}
          />
        )}
      </Block>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DatetimeSettingsBlock };
export default DatetimeSettingsBlock;
//@@viewOff:exports
