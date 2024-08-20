//@@viewOn:imports
import { createVisualComponent, Lsi, useState } from "uu5g05";
import Config from "./config/config.js";
import { CancelButton, Form, FormNumber, FormSelect, Message, ResetButton, SubmitButton } from "uu5g05-forms";
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

const UpdateNotificationOffsetModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdateNotificationOffsetModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ open, onClose, initialValues, frequency, onSubmit }) {
    //@@viewOn:private
    const [error, setError] = useState(null);
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Form.Provider onSubmit={onSubmit}>
        <Modal
          open={open}
          onClose={onClose}
          header={<Lsi lsi={{ en: "Change notification offset", cs: "Změnit posun upozornění" }} />}
          footer={
            <Grid templateColumns={{ xs: "40px repeat(2, 1fr)", s: "repeat(3, auto)" }} justifyContent={{ s: "end" }}>
              <ResetButton significance="subdued" icon="mdi-refresh" />
              <CancelButton onClick={onClose} />
              <SubmitButton disabled={!!error}>
                <Lsi lsi={{ en: "Change", cs: "Změnit" }} />
              </SubmitButton>
            </Grid>
          }
        >
          <Form.View>
            <Grid
              templateColumns={{ xs: "100", s: "repeat(3,1fr)" }}
              templateRows={{ xs: "repeat(3, 1fr)", s: "100%" }}
              alignItems={"start"}
            >
              <FormNumber
                name="days"
                label={{ en: "Days", cs: "Dny" }}
                max={31}
                min={0}
                step={1}
                required
                initialValue={initialValues.days}
                validateOnChange
                onValidate={async (e) => {
                  const days = e.data.value;
                  const hours = e.data.form.value.hours;
                  if (days === hours && hours === 0) {
                    return setError({
                      code: "invalidNotificationOffset",
                      feedback: "error",
                      message: {
                        en: "Notification offset must be at least 1 hour.",
                        cs: "Posun upozornění musí být aspoň 1 hodina.",
                      },
                    });
                  }
                  if (frequency.months === 0) {
                    if (days * 24 + hours > frequency.days * 24) {
                      return setError({
                        message: {
                          en: "Notification offset cannot be greater than frequency.",
                          cs: "Posun upozornění nemůže být větší než frekvence.",
                        },
                      });
                    }
                  }
                  setError(null);
                }}
                validationMap={{
                  badValue: {
                    feedback: "error",
                    message: {
                      en: "Number of days must be an integer.",
                      cs: "Počet dní musí být celé číslo.",
                    },
                  },
                  max: {
                    feedback: "error",
                    message: {
                      en: "Maximum allowed number of days is %d.",
                      cs: "Nejvyšší povolený počet dní je %d.",
                    },
                  },
                  min: {
                    feedback: "error",
                    message: {
                      en: "Minimum allowed number of days is %d.",
                      cs: "Nejnižší povolený počet dní je %d.",
                    },
                  },
                  required: {
                    feedback: "error",
                    message: {
                      en: "Number of days is required.",
                      cs: "Počet dní je povinný parametr.",
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
              <FormNumber
                name="hours"
                label={{ en: "Hours", cs: "Hodiny" }}
                max={23}
                min={0}
                step={1}
                required
                initialValue={initialValues.hours}
                validateOnChange
                onValidate={async (e) => {
                  const days = e.data.form.value.days;
                  const hours = e.data.value;
                  if (days === hours && hours === 0) {
                    return setError({
                      message: {
                        en: "Notification offset must be at least 1 hour.",
                        cs: "Posun upozornění musí být aspoň 1 hodina.",
                      },
                    });
                  }
                  if (frequency.months === 0) {
                    if (days * 24 + hours > frequency.days * 24) {
                      return setError({
                        message: {
                          en: "Notification offset cannot be greater than frequency.",
                          cs: "Posun upozornění nemůže být větší než frekvence.",
                        },
                      });
                    }
                  }
                  setError(null);
                }}
                validationMap={{
                  badValue: {
                    feedback: "error",
                    message: {
                      en: "Value must be an integer.",
                      cs: "Hodnota musí být celé číslo.",
                    },
                  },
                  max: {
                    feedback: "error",
                    message: {
                      en: "Maximum allowed value is %d.",
                      cs: "Nejvyšší povolená hodnota je %d.",
                    },
                  },
                  min: {
                    feedback: "error",
                    message: {
                      en: "Minimum allowed value is %d.",
                      cs: "Nejnižší povolená hodnota je %d.",
                    },
                  },
                  required: {
                    feedback: "error",
                    message: {
                      en: "Value is required.",
                      cs: "Povinný parametr.",
                    },
                  },
                  step: {
                    feedback: "error",
                    message: {
                      en: "Value must be an integer.",
                      cs: "Hodnota musí být celé číslo.",
                    },
                  },
                }}
              />
              <FormSelect
                name="minutes"
                label={{ en: "Minutes", cs: "Minuty" }}
                itemList={[
                  { value: 0, children: "0" },
                  { value: 15, children: "15" },
                  { value: 30, children: "30" },
                  { value: 45, children: "45" },
                ]}
                required
                initialValue={initialValues.minutes}
              />
            </Grid>
            {!!error && (
              <Message feedback="error" style={{ marginTop: "12px" }}>
                <Lsi lsi={error.message} />
              </Message>
            )}
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { UpdateNotificationOffsetModal };
export default UpdateNotificationOffsetModal;
//@@viewOff:exports
