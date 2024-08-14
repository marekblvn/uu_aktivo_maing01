//@@viewOn:imports
import { createVisualComponent, Lsi, useState, Utils } from "uu5g05";
import Config from "./config/config.js";
import { CancelButton, Form, FormNumber, Label, SubmitButton } from "uu5g05-forms";
import { Grid, Modal, Text } from "uu5g05-elements";
import Calls from "../calls.js";
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

  render({ open, onClose, initialValues, activityId, notificationOffset, onSubmit }) {
    //@@viewOn:private
    const [monthsValue, setMonthsValue] = useState(initialValues.months);
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Form.Provider
        onSubmit={onSubmit}
        onValidate={async (e) => {
          try {
            await Calls.Activity.updateFrequency({ id: activityId, frequency: e.data.value });
          } catch (error) {
            const validationResult = {
              feedback: "error",
              message: error.message,
            };
            return validationResult;
          }
        }}
      >
        <Modal
          open={open}
          onClose={onClose}
          header={<Lsi lsi={{ en: "Change frequency", cs: "Změnit frekvenci" }} />}
          footer={
            <Grid templateColumns={{ xs: "repeat(2, 1fr)", s: "repeat(2, auto)" }} justifyContent={{ s: "end" }}>
              <CancelButton onClick={onClose} />
              <SubmitButton>
                <Lsi lsi={{ en: "Change", cs: "Změnit" }} />
              </SubmitButton>
            </Grid>
          }
        >
          <Form.View>
            <Grid templateColumns={"repeat(2, 1fr)"} alignItems={"flex-start"}>
              <FormNumber
                name="months"
                label={{ en: "Months", cs: "Měsíce" }}
                min={0}
                max={12}
                step={1}
                required
                initialValue={initialValues.months}
                validateOnChange
                onChange={(e) => {
                  setMonthsValue(e.data.value);
                  e.data.form.setItemValue("months", e.data.value);
                }}
                validationMap={{
                  badValue: {
                    feedback: "error",
                    message: {
                      en: "Number of months must be an integer.",
                      cs: "Počet měsíců musí být celé číslo.",
                    },
                  },
                  min: {
                    feedback: "error",
                    message: {
                      en: "Minimum allowed number of months is 0.",
                      cs: "Minimální povolený počet měsíců je 0.",
                    },
                  },
                  required: {
                    feedback: "error",
                    message: {
                      en: "Number of months is required.",
                      cs: "Počet měsíců je povinný parametr.",
                    },
                  },
                  max: {
                    feedback: "error",
                    message: {
                      en: "Maximum allowed number of months is 12.",
                      cs: "Maximální povolený počet měsíců je 12.",
                    },
                  },
                  step: {
                    feedback: "error",
                    message: {
                      en: "Number of months must be an integer.",
                      cs: "Počet měsíců musí být celé číslo.",
                    },
                  },
                }}
              />
              <FormNumber
                name="days"
                label={{ en: "Days", cs: "Dny" }}
                min={monthsValue === 0 ? notificationOffset.days + 1 : 0}
                max={31}
                step={1}
                required
                initialValue={initialValues.days}
                validateOnChange
                onValidate={(e) => console.log(e)}
                validationMap={{
                  badValue: {
                    feedback: "error",
                    message: {
                      en: "Number of days must be an integer.",
                      cs: "Počet dní musí být celé číslo.",
                    },
                  },
                  min: {
                    feedback: "error",
                    message: {
                      en: `Minimum allowed number of days is ${monthsValue === 0 ? notificationOffset.days + 1 : 0}.`,
                      cs: `Minimální povolený počet dní je ${monthsValue === 0 ? notificationOffset.days + 1 : 0}.`,
                    },
                  },
                  required: {
                    feedback: "error",
                    message: {
                      en: "Number of days is required.",
                      cs: "Počet dní je povinný parametr.",
                    },
                  },
                  max: {
                    feedback: "error",
                    message: {
                      en: "Maximum allowed number of days is 31.",
                      cs: "Maximální povolený počet dní je 31.",
                    },
                  },
                  step: {
                    feedback: "error",
                    message: {
                      en: "Number of days must be an integer.",
                      cs: "Počet dní musí být celé číslo.",
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
