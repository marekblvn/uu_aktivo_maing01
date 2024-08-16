//@@viewOn:imports
import { createVisualComponent, Lsi } from "uu5g05";
import Config from "./config/config.js";
import { CancelButton, Form, FormNumber, ResetButton, SubmitButton } from "uu5g05-forms";
import { Grid, Modal } from "uu5g05-elements";
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
            <Grid templateColumns={{ xs: "100%", s: "repeat(2, 1fr)" }} alignItems={"start"}>
              <FormNumber
                name="months"
                label={{ en: "Months", cs: "Měsíce" }}
                min={0}
                max={12}
                step={1}
                required
                initialValue={initialValues.months}
                validateOnChange
                onValidate={async (e) => {
                  const months = e.data.value;
                  const days = e.data.form.value.days;
                  if (months === days && days === 0)
                    return {
                      code: "frequencyCannotBeZero",
                      feedback: "error",
                      message: {
                        en: "Number of months and number of days cannot both be zero.",
                        cs: "Počet měsíců a počet dní nesmí být obojí nula.",
                      },
                    };
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
                min={0}
                max={31}
                step={1}
                required
                initialValue={initialValues.days}
                validateOnChange
                onValidate={async (e) => {
                  const days = e.data.value;
                  const months = e.data.form.value.months;
                  if (months === days && days === 0)
                    return {
                      code: "frequencyCannotBeZero",
                      feedback: "error",
                      message: {
                        en: "Number of months and number of days cannot both be zero.",
                        cs: "Počet měsíců a počet dní nesmí být obojí nula.",
                      },
                    };
                  if (months === 0 && days < notificationOffset.days + 1) {
                    return {
                      code: "invalidFrequency",
                      feedback: "error",
                      message: {
                        en: "Minimum possible number of days is %d.",
                        cs: "Nejnižší povolený počet dní je %d.",
                      },
                      messageParams: [notificationOffset.days + 1],
                    };
                  }
                }}
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
                      en: `Minimum allowed number of days is %d.`,
                      cs: `Nejnižší povolený počet dní je %d.`,
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
                      cs: "Nejvyšší povolený počet dní je 31.",
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
