//@@viewOn:imports
import { createVisualComponent, Lsi, useRef, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import { Button, Grid, Modal, Pending } from "uu5g05-elements";
import { Form, FormText } from "uu5g05-forms";
import generatePDF from "react-to-pdf";
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

const SaveAttendanceModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "SaveAttendanceModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ open, onClose, initialFilename, children }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const targetRef = useRef();
    const [filename, setFilename] = useState(initialFilename);
    const [pending, setPending] = useState(false);
    //@@viewOff:private

    const handleSavePDF = async () => {
      setPending(true);
      await generatePDF(targetRef, { filename: filename + ".pdf" });
      setPending(false);
      onClose();
    };

    //@@viewOn:render

    return (
      <Form.Provider>
        <Modal
          open={open && ["xl", "l"].includes(screenSize)}
          onClose={onClose}
          header={<Lsi lsi={{ en: `Save attendance statistic`, cs: `Uložit statistiky docházky` }} />}
          footer={
            <Grid
              templateColumns={{ xs: "repeat(2, 1fr)", s: "repeat(2, auto)" }}
              justifyContent={{ s: "space-between" }}
              alignItems={{ xs: "end" }}
            >
              <FormText
                name="filename"
                label={{ en: "Choose file name", cs: "Zadejte název souboru" }}
                autoFocus
                required
                minLength={1}
                maxLength={48}
                pattern="^[\w\-.\s]+$"
                suffix=".pdf"
                initialValue={filename}
                onChange={(e) => setFilename(e.data.value)}
                layout="1:2"
                messagePosition="tooltip"
                validationMap={{
                  required: {
                    feedback: "error",
                    message: {
                      en: "File name cannot be empty",
                      cs: "Zadejte prosím název souboru",
                    },
                  },
                  badValue: {
                    feedback: "error",
                    message: {
                      en: "File name cannot be empty",
                      cs: "Zadejte prosím název souboru",
                    },
                  },
                  minLength: {
                    feedback: "error",
                    message: {
                      en: "File name cannot be empty",
                      cs: "Zadejte prosím název souboru",
                    },
                  },
                  maxLength: {
                    feedback: "error",
                    message: {
                      en: "File name cannot exceed 48 characters",
                      cs: "Název souboru nemůže být delší než 48 znaků",
                    },
                  },
                  pattern: {
                    feedback: "error",
                    message: {
                      en: "Please make sure that the file name does not include any characters that could cause problems in your filesystem",
                      cs: "Zkontrolujte prosím, že název souboru neobsahuje žádné znaky, které by mohly způsobit problémy ve vašem systému",
                    },
                  },
                }}
                style={{ maxWidth: "504px" }}
              />
              <Grid templateColumns={{ xs: "repeat(2,1fr)" }}>
                <Button onClick={onClose}>
                  <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />
                </Button>
                <Button colorScheme="primary" onClick={handleSavePDF}>
                  {pending ? (
                    <Pending size="xs" colorScheme="primary" />
                  ) : (
                    <Lsi lsi={{ en: "Save as PDF", cs: "Uložit jako PDF" }} />
                  )}
                </Button>
              </Grid>
            </Grid>
          }
          width="full"
        >
          <Form.View>
            <Grid>
              <div ref={targetRef}>{children}</div>
            </Grid>
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { SaveAttendanceModal };
export default SaveAttendanceModal;
//@@viewOff:exports
