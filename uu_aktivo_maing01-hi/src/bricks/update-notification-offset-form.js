//@@viewOn:imports
import { createVisualComponent, useEffect, useState } from "uu5g05";
import Config from "./config/config.js";
import { Form, FormNumber, FormSelect, useFormApi } from "uu5g05-forms";
import { Grid } from "uu5g05-elements";
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

const UpdateNotificationOffsetForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdateNotificationOffsetForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ initialValues, frequency }) {
    //@@viewOn:private
    const { setItemState } = useFormApi();
    const [error, setError] = useState(null);
    //@@viewOff:private

    useEffect(() => {
      if (error) {
        setItemState("days", {
          valid: false,
          errorList: [error],
        });
        setItemState("hours", {
          valid: false,
          errorList: [error],
        });
        return;
      }
      setItemState("days", {
        valid: true,
      });
      setItemState("hours", {
        valid: true,
      });
    }, [error]);

    //@@viewOn:render
    return (
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
                    code: "tooGreat",
                    feedback: "error",
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
                    code: "tooGreate",
                    feedback: "error",
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
      </Form.View>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { UpdateNotificationOffsetForm };
export default UpdateNotificationOffsetForm;
//@@viewOff:exports
