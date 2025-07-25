//@@viewOn:imports
import { createVisualComponent, Lsi, PropTypes, useEffect, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import {
  CancelButton,
  Form,
  FormCheckbox,
  FormDateTime,
  FormNumber,
  FormSelect,
  Label,
  SubmitButton,
  useFormApi,
} from "uu5g05-forms";
import { Grid, Line, Modal } from "uu5g05-elements";
import { FREQUENCY_OPTIONS } from "../../utils/frequency-utils.js";
import importLsi from "../lsi/import-lsi.js";
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

const CreateDatetimeForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateDatetimeForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    open: false,
    onClose: () => {},
    onSubmit: () => {},
  },
  //@@viewOff:defaultProps

  render({ open, onClose, onSubmit }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const now = new Date();
    now.setHours(now.getHours() + 13, 0, 0, 0);
    const [minDatetimeValue, setMinDatetimeValue] = useState(now);
    const [isRecurrent, setIsRecurrent] = useState(false);
    const [notificationOffsetError, setNotificationOffsetError] = useState(null);
    //@@viewOff:private

    useEffect(() => {
      const updateMinDatetimeValueInterval = setInterval(() => {
        now.setMinutes(now.getMinutes() + 1);
        setMinDatetimeValue(now);
      }, 60_000);
      return () => clearInterval(updateMinDatetimeValueInterval);
    }, []);

    //@@viewOn:render
    return (
      <Form.Provider
        onSubmit={async (e) => {
          if (!!notificationOffsetError) return;
          const {
            datetime,
            recurrent,
            frequency,
            notificationOffsetDays,
            notificationOffsetHours,
            notificationOffsetMinutes,
          } = e.data.value;
          const submitObj = {
            datetime,
            recurrent,
            notificationOffset: {
              days: notificationOffsetDays,
              hours: notificationOffsetHours,
              minutes: notificationOffsetMinutes,
            },
          };

          if (frequency) {
            submitObj.frequency = frequency;
          }

          return await onSubmit({ value: submitObj });
        }}
      >
        <Modal
          open={open}
          onClose={onClose}
          header={<Lsi import={importLsi} path={["Forms", "createDatetime", "header"]} />}
          footer={
            <Grid templateColumns={{ xs: "repeat(2,1fr)", s: "repeat(2,auto)" }} justifyContent={{ s: "end" }}>
              <CancelButton onClick={onClose} />
              <SubmitButton disabled={!!notificationOffsetError}>
                <Lsi import={importLsi} path={["Forms", "createDatetime", "submit"]} />
              </SubmitButton>
            </Grid>
          }
        >
          <Form.View>
            <Grid>
              <Grid>
                <FormDateTime
                  name="datetime"
                  label={{ en: "Date and time of the datetime", cs: "Datum a čas termínu" }}
                  min={minDatetimeValue.toISOString()}
                  step={60}
                  required
                  validationMap={{
                    badValue: {
                      feedback: "error",
                      message: {
                        en: "Please enter a valid date and time values.",
                        cs: "Zadejte, prosím, datum a čas ve správném formátu.",
                      },
                    },
                    min: {
                      feedback: "error",
                      message: {
                        en: `Cannot set a date and time that is before ${minDatetimeValue.toLocaleString()}.`,
                        cs: `Nelze nastavit datum a čas před ${minDatetimeValue.toLocaleString()}.`,
                      },
                    },
                  }}
                />
                <FormCheckbox
                  name="recurrent"
                  label={{ en: "Recurrent", cs: "Opakující se" }}
                  info={{
                    en: "The datetime will be automatically renewed based on the set frequency.",
                    cs: "Termín se bude automaticky obnovovat podle zadané frekvence.",
                  }}
                  style={{ maxWidth: "140px" }}
                  box={false}
                  initialValue={isRecurrent}
                  onChange={(e) => setIsRecurrent(!isRecurrent)}
                />
              </Grid>
              {isRecurrent && (
                <>
                  <Line colorScheme="neutral" significance="subdued" />
                  <Grid templateRows="1fr" templateColumns={{ xs: "auto 1fr" }} alignItems="start">
                    <Label
                      size={["xl", "l", "m"].includes(screenSize) ? "m" : "s"}
                      required={true}
                      style={{ paddingTop: "7px" }}
                    >
                      <Lsi lsi={{ en: "Repeat every", cs: "Opakovat každý(é)" }} />
                    </Label>
                    <FormSelect
                      style={{ width: screenSize === "xs" ? "auto" : "180px" }}
                      name="frequency"
                      required
                      itemList={FREQUENCY_OPTIONS}
                      initialValue={FREQUENCY_OPTIONS[3].value}
                    />
                  </Grid>
                </>
              )}
              <Line colorScheme="neutral" significance="subdued" />
              <Label size={["xl", "l", "m"].includes(screenSize) ? "m" : "s"} required={true}>
                <Lsi lsi={{ en: "Notification offset", cs: "Posun upozornění" }} />
              </Label>
              <Grid templateColumns="100%" templateRows={{ xs: "1fr auto" }}>
                <Grid
                  templateColumns={{ xs: "repeat(4, 1fr)", s: "repeat(6, 1fr)" }}
                  templateRows={{ xs: "1fr 1fr", s: "100%" }}
                  alignItems="start"
                  columnGap="4px"
                >
                  <FormNumber
                    name="notificationOffsetDays"
                    min={0}
                    max={31}
                    step={1}
                    required
                    alignment="right"
                    colorScheme={!!notificationOffsetError ? "negative" : "building"}
                    onValidate={(e) => {
                      if (e.data.value === e.data.form.value.notificationOffsetHours && e.data.value === 0) {
                        return setNotificationOffsetError({
                          message: {
                            en: "Notification offset must be at least 1 hour.",
                            cs: "Posun upozornění musí být aspoň 1 hodina.",
                          },
                        });
                      }
                      if (e.data.form.value.datetime) {
                        const notificationDate = new Date(e.data.form.value.datetime);
                        notificationDate.setDate(notificationDate.getDate() - (e.data.value || 0));
                        notificationDate.setHours(
                          notificationDate.getHours() - (e.data.form.value.notificationOffsetHours || 0),
                          notificationDate.getMinutes() - (e.data.form.value.notificationOffsetMinutes || 0),
                        );
                        if (notificationDate < new Date()) {
                          return setNotificationOffsetError({
                            message: {
                              en: "The date of the notification will be in the past. This is because the notification offset is too big.",
                              cs: "Datum upozornění bude v minulosti. Příčinou je příliš velký posun upozornění.",
                            },
                          });
                        }
                      }
                      if (e.data.form.value.frequency && e.data.form.value.datetime) {
                        const nextNotificationDate = new Date(e.data.form.value.datetime);
                        nextNotificationDate.setMonth(
                          nextNotificationDate.getMonth() + e.data.form.value.frequency.months,
                        );
                        nextNotificationDate.setDate(
                          nextNotificationDate.getDate() + e.data.form.value.frequency.days - e.data.value,
                        );
                        nextNotificationDate.setHours(
                          nextNotificationDate.getHours() - e.data.form.value.notificationOffsetHours,
                          nextNotificationDate.getMinutes() - e.data.form.value.notificationOffsetMinutes,
                        );
                        if (nextNotificationDate < new Date(e.data.form.value.datetime)) {
                          return setNotificationOffsetError({
                            message: {
                              en: "Notification offset cannot be greater than frequency.",
                              cs: "Posun upozornění nemůže být větší něž frekvence.",
                            },
                          });
                        }
                      }
                      setNotificationOffsetError(null);
                    }}
                    validationMap={{
                      badValue: {
                        feedback: "error",
                        message: {
                          en: "Must be an integer.",
                          cs: "Musí být celé číslo",
                        },
                      },
                      required: {
                        feedback: "error",
                        message: {
                          en: "Required value",
                          cs: "Povinný parametr",
                        },
                      },
                      min: {
                        feedback: "error",
                        message: {
                          en: "Can't be less than %s.",
                          cs: "Nemůže být menší, než %s.",
                        },
                      },
                      max: {
                        feedback: "error",
                        message: {
                          en: "Can't be more than %s.",
                          cs: "Nemůže být větší než %s.",
                        },
                      },
                      step: {
                        feedback: "error",
                        message: {
                          en: "Must be an integer.",
                          cs: "Musí být celé číslo",
                        },
                      },
                    }}
                  />
                  <Label
                    style={{ alignContent: "center", textAlign: "left", paddingTop: "7px" }}
                    size={["xl", "l", "m"].includes(screenSize) ? "m" : screenSize === "s" ? "s" : "xs"}
                  >
                    <Lsi lsi={{ en: "day(s),", cs: "den/dní," }} />
                  </Label>
                  <FormNumber
                    name="notificationOffsetHours"
                    min={0}
                    max={23}
                    step={1}
                    required
                    alignment="right"
                    colorScheme={!!notificationOffsetError ? "negative" : "building"}
                    onValidate={(e) => {
                      if (e.data.value === e.data.form.value.notificationOffsetDays && e.data.value === 0) {
                        return setNotificationOffsetError({
                          message: {
                            en: "Notification offset must be at least 1 hour.",
                            cs: "Posun upozornění musí být aspoň 1 hodina.",
                          },
                        });
                      }

                      if (e.data.form.value.datetime) {
                        const notificationDate = new Date(e.data.form.value.datetime);
                        notificationDate.setDate(
                          notificationDate.getDate() - (e.data.form.value.notificationOffsetDays || 0),
                        );
                        notificationDate.setHours(
                          notificationDate.getHours() - (e.data.value || 0),
                          notificationDate.getMinutes() - (e.data.form.value.notificationOffsetMinutes || 0),
                        );
                        if (notificationDate < new Date()) {
                          return setNotificationOffsetError({
                            message: {
                              en: "The date of the notification will be in the past. This is because the notification offset is too big.",
                              cs: "Datum upozornění bude v minulosti. Příčinou je příliš velký posun upozornění.",
                            },
                          });
                        }
                      }
                      if (e.data.form.value.frequency && e.data.form.value.datetime) {
                        const nextNotificationDate = new Date(e.data.form.value.datetime);
                        nextNotificationDate.setMonth(
                          nextNotificationDate.getMonth() + e.data.form.value.frequency.months,
                        );
                        nextNotificationDate.setDate(
                          nextNotificationDate.getDate() +
                            e.data.form.value.frequency.days -
                            e.data.form.value.notificationOffsetDays,
                        );
                        nextNotificationDate.setHours(
                          nextNotificationDate.getHours() - e.data.value,
                          nextNotificationDate.getMinutes() - e.data.form.value.notificationOffsetMinutes,
                        );
                        if (nextNotificationDate < new Date(e.data.form.value.datetime)) {
                          return setNotificationOffsetError({
                            message: {
                              en: "Notification offset cannot be greater than frequency.",
                              cs: "Posun upozornění nemůže být větší něž frekvence.",
                            },
                          });
                        }
                      }
                      setNotificationOffsetError(null);
                    }}
                    validationMap={{
                      badValue: {
                        feedback: "error",
                        message: {
                          en: "Must be an integer.",
                          cs: "Musí být celé číslo",
                        },
                      },
                      required: {
                        feedback: "error",
                        message: {
                          en: "Required value",
                          cs: "Povinný parametr",
                        },
                      },
                      min: {
                        feedback: "error",
                        message: {
                          en: "Can't be less than %s.",
                          cs: "Nemůže být menší, než %s.",
                        },
                      },
                      max: {
                        feedback: "error",
                        message: {
                          en: "Can't be more than %s.",
                          cs: "Nemůže být větší než %s.",
                        },
                      },
                      step: {
                        feedback: "error",
                        message: {
                          en: "Must be an integer.",
                          cs: "Musí být celé číslo",
                        },
                      },
                    }}
                  />
                  <Label
                    style={{ alignContent: "center", textAlign: "left", paddingTop: "7px" }}
                    size={["xl", "l", "m"].includes(screenSize) ? "m" : screenSize === "s" ? "s" : "xs"}
                  >
                    <Lsi lsi={{ en: "hour(s),", cs: "hodin(y)," }} />
                  </Label>
                  <FormSelect
                    name="notificationOffsetMinutes"
                    required
                    alignment="right"
                    itemList={[
                      { children: "0", value: 0 },
                      { children: "15", value: 15 },
                      { children: "30", value: 30 },
                      { children: "45", value: 45 },
                    ]}
                    initialValue={0}
                  />
                  <Label
                    style={{ alignContent: "center", textAlign: "left", paddingTop: "7px" }}
                    size={["xl", "l", "m"].includes(screenSize) ? "m" : screenSize === "s" ? "s" : "xs"}
                  >
                    <Lsi lsi={{ en: "minutes", cs: "minut" }} />
                  </Label>
                </Grid>
                {notificationOffsetError && (
                  <Label
                    size={["xl", "l", "m"].includes(screenSize) ? "m" : screenSize === "s" ? "s" : "xs"}
                    colorScheme="problem"
                    style={{ fontStyle: "italic" }}
                  >
                    <Lsi lsi={notificationOffsetError.message} />
                  </Label>
                )}
              </Grid>
            </Grid>
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { CreateDatetimeForm };
export default CreateDatetimeForm;
//@@viewOff:exports
