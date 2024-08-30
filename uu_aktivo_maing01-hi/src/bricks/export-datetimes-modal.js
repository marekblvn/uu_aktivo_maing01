//@@viewOn:imports
import { createVisualComponent, Environment, Lsi, useEffect, useState } from "uu5g05";
import Config from "./config/config.js";
import { Block, Button, Grid, Link, Modal, Text } from "uu5g05-elements";
import { Date as DatePicker, Label } from "uu5g05-forms";
import { QRCode } from "uu5extrasg01";
import ical, { ICalAlarmType } from "ical-generator";
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

const ExportDatetimesModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ExportDatetimesModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ open, onClose, datetime, activity }) {
    //@@viewOn:private
    const { name, location, frequency, recurrent, notificationOffset } = activity;
    const yearFromNow = new Date();
    yearFromNow.setHours(0, 0, 0, 0);
    yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);
    const [maxDate, setMaxDate] = useState(yearFromNow.toISOString().substring(0, 10));
    const [qrCodeUrl, setQRCodeUrl] = useState(null);
    //@@viewOff:private

    useEffect(() => {
      if (!recurrent) {
        const cal = ical({ name: name });
        let date = new Date(datetime);
        let end = new Date(date.getTime() + 60 * 60 * 1000);

        cal.createEvent({
          start: date,
          end: end,
          summary: name,
          location: location,
          sequence: 0,
          url: Environment.appBaseUri + `activity?id=${activity.id}&tab=information`,
          alarms: [
            {
              type: ICalAlarmType.display,
              trigger:
                notificationOffset.days * 86400 + notificationOffset.hours * 3600 + notificationOffset.minutes * 60,
            },
          ],
        });

        const blob = new Blob([cal.toString()], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        setQRCodeUrl(url);
      }
    }, [recurrent]);

    const generateUID = () => `event-series-${Date.now()}`;

    const generateICal = () => {
      const cal = ical({ name: name });
      const uid = generateUID();
      let currentDate = new Date(datetime);
      const endDate = new Date(maxDate);
      let iteration = 1;

      while (currentDate <= endDate) {
        cal.createEvent({
          start: new Date(currentDate),
          end: new Date(currentDate.getTime() + 60 * 60 * 1000),
          summary: `${name} - ${iteration}`,
          location: location,
          uid: uid,
          sequence: 0,
          url: Environment.appBaseUri + `activity?id=${activity.id}&tab=information`,
          alarms: [
            {
              type: ICalAlarmType.display,
              trigger:
                notificationOffset.days * 86400 + notificationOffset.hours * 3600 + notificationOffset.minutes * 60,
            },
          ],
        });

        iteration++;

        currentDate.setMonth(currentDate.getMonth() + frequency.months);
        currentDate.setDate(currentDate.getDate() + frequency.days);
      }

      return cal.toString();
    };

    const handleExportCalendar = () => {
      const icalContent = generateICal();
      const blob = new Blob([icalContent], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      setQRCodeUrl(url);
    };

    //@@viewOn:render
    return (
      <Modal open={open} onClose={onClose} header={<Lsi lsi={{ en: "Export datetimes", cs: "Exportovat termíny" }} />}>
        {recurrent && (
          <>
            <Label>
              <Lsi
                lsi={{
                  en: "Please select to which date you want to generate dates: ",
                  cs: "Prosím vyberte do kdy chcete vygenerovat termíny:",
                }}
              />
            </Label>
            <Grid templateColumns={{ xs: "auto 32px" }}>
              <DatePicker
                value={maxDate}
                max={yearFromNow.toISOString().substring(0, 10)}
                onChange={(e) => setMaxDate(e.data.value)}
              />
              <Button icon="uugdsstencil-uiaction-download" disabled={!maxDate} onClick={handleExportCalendar} />
            </Grid>
          </>
        )}
        {qrCodeUrl && (
          <Block card="full" style={{ marginTop: "16px" }}>
            <Grid templateColumns={{ xs: "100%" }} justifyItems={{ xs: "center" }} alignItems={{ xs: "center" }}>
              <Text>
                <Lsi lsi={{ en: "Scan the QR code", cs: "Načtěte QR kód" }} />
              </Text>
              <QRCode value={qrCodeUrl} />
              <Text style={{ textAlign: "center" }}>
                <Lsi lsi={{ en: "or click on this", cs: "nebo klikněte na" }} />
                <Link href={qrCodeUrl} download={true} style={{ marginLeft: "4px", textDecoration: "underline" }}>
                  <Lsi lsi={{ en: "link", cs: "odkaz" }} />
                </Link>
                <Lsi lsi={{ en: " to download calendar.", cs: " pro stažení kalendáře." }} />
              </Text>
            </Grid>
          </Block>
        )}
      </Modal>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ExportDatetimesModal };
export default ExportDatetimesModal;
//@@viewOff:exports
