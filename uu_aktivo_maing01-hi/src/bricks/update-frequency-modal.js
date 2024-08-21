//@@viewOn:imports
import { createVisualComponent, Lsi } from "uu5g05";
import Config from "./config/config.js";
import { CancelButton, Form, FormSelect, ResetButton, SubmitButton } from "uu5g05-forms";
import { Grid, Modal } from "uu5g05-elements";
import { getFrequencyOption, limitedFrequencyOptions } from "../../utils/frequency-utils.js";
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

const UpdateFrequencyModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdateFrequencyModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ open, onClose, initialValues, notificationOffset, onSubmit }) {
    //@@viewOn:private
    const initialOption = getFrequencyOption(initialValues);
    //@@viewOff:private
    //@@viewOn:render
    return (
      <Form.Provider onSubmit={onSubmit}>
        <Modal
          open={open}
          onClose={onClose}
          header={<Lsi lsi={{ en: "Change frequency", cs: "Změnit frekvenci" }} />}
          footer={
            <Grid templateColumns={{ xs: "40px repeat(2, 1fr)", s: "repeat(3, auto)" }} justifyContent={{ s: "end" }}>
              <ResetButton significance="subdued" icon="mdi-refresh" />
              <CancelButton onClick={onClose} />
              <SubmitButton>
                <Lsi lsi={{ en: "Change", cs: "Změnit" }} />
              </SubmitButton>
            </Grid>
          }
        >
          <Form.View>
            <Grid templateColumns={{ xs: "100%" }} alignItems={"start"}>
              <FormSelect
                name="frequency"
                label={{ en: "Datetime recurrence frequency", cs: "Frekvence opakování termínu" }}
                required
                itemList={limitedFrequencyOptions(notificationOffset)}
                initialValue={initialOption.value}
                validationMap={{
                  badValue: {
                    feedback: "error",
                    message: {
                      en: "Bad frequency value, please select one of the options.",
                      cs: "Špatná hodnota frekvence, vyberte prosím jednu z možností.",
                    },
                  },
                }}
              />
            </Grid>
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { UpdateFrequencyModal };
export default UpdateFrequencyModal;
//@@viewOff:exports
