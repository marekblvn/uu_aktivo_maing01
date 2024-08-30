//@@viewOn:imports
import { createVisualComponent, Lsi, useState } from "uu5g05";
import Config from "./config/config.js";
import { Button, Grid, Link, Modal } from "uu5g05-elements";
import { Date as DatePicker, Label } from "uu5g05-forms";
import { QRCode } from "uu5extrasg01";
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
    const [qrCodeUrl, setQRCodeUrl] = useState("aaa");
    //@@viewOff:private

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
              <Button icon="uugdsstencil-uiaction-download" disabled={!maxDate} onClick={() => {}} />
            </Grid>
          </>
        )}
        {qrCodeUrl && (
          <Grid
            templateColumns={{ xs: "100%" }}
            justifyItems={{ xs: "center" }}
            alignItems={{ xs: "center" }}
            style={{ marginTop: "48px", marginBottom: "16px" }}
          >
            <QRCode value={qrCodeUrl} />
            <Link href={qrCodeUrl} download={true} style={{ marginTop: "16px" }}>
              <Lsi lsi={{ en: "Download the calendar", cs: "Stáhnout kalendář" }} />{" "}
            </Link>
          </Grid>
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
