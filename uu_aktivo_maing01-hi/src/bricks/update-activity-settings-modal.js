//@@viewOn:imports
import { createVisualComponent, Lsi, useRef, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import { CancelButton, Form, FormNumber, FormText, FormTextArea, ResetButton, SubmitButton } from "uu5g05-forms";
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

const UpdateActivitySettingsModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdateActivitySettingsModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ open, initialValues, onSubmit, onClose }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const [minParticipantsValue, setMinParticipantsValue] = useState(initialValues.minParticipants || 0);
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Form.Provider onSubmit={onSubmit}>
        <Modal
          open={open}
          onClose={onClose}
          header={<Lsi lsi={{ en: "Edit activity settings", cs: "Upravit nastavení aktivity" }} />}
          footer={
            <Grid templateColumns={{ xs: "40px repeat(2, 1fr)", s: "repeat(3, auto)" }} justifyContent={{ s: "end" }}>
              <ResetButton significance="subdued" icon="mdi-refresh" />
              <CancelButton onClick={onClose} />
              <SubmitButton>
                <Lsi lsi={{ en: "Edit", cs: "Upravit" }} />
              </SubmitButton>
            </Grid>
          }
        >
          <Form.View>
            <Grid>
              <Grid>
                <FormText
                  name="name"
                  label={{ en: "Name", cs: "Název" }}
                  maxLength={48}
                  minLength={1}
                  required={true}
                  initialValue={initialValues.name || ""}
                  validateOnChange
                  validationMap={{
                    required: {
                      message: { en: "Name is required", cs: "Název je povinný" },
                      feedback: "error",
                    },
                    minLength: {
                      message: { en: "Name is required", cs: "Název je povinný" },
                      feedback: "error",
                    },
                    maxLength: {
                      message: {
                        en: "Name cannot be longer than 48 characters",
                        cs: "Název nesmí být delší než 48 znaků",
                      },
                      feedback: "error",
                    },
                  }}
                />
                <FormText
                  name="location"
                  label={{ en: "Location", cs: "Lokace" }}
                  maxLength={60}
                  minLength={0}
                  required={false}
                  initialValue={initialValues.location || ""}
                  validateOnChange
                  validationMap={{
                    maxLength: {
                      message: {
                        en: "Location cannot be longer than 60 characters",
                        cs: "Lokace nesmí být delší než 60 znaků",
                      },
                      feedback: "error",
                    },
                  }}
                />
              </Grid>
              <FormTextArea
                name="description"
                label={{ en: "Description", cs: "Popis" }}
                maxLength={256}
                minLength={0}
                initialValue={initialValues.description || ""}
                required={false}
                autoResize
                rows={3}
                maxRows={5}
                spellCheck
                validateOnChange
                validationMap={{
                  maxLength: {
                    message: {
                      en: "Description cannot be longer than 256 characters",
                      cs: "Popis nesmí být delší než 256 znaků",
                    },
                  },
                }}
              />
              <Grid
                templateRows={{ xs: "repeat(2, 1fr)", s: "1fr" }}
                templateColumns={{ xs: "1fr", s: "repeat(2, 1fr)" }}
              >
                <FormNumber
                  name="minParticipants"
                  label={{ en: "Minimum number of participants", cs: "Minimální počet účastníků" }}
                  iconRight="mdi-account-cancel"
                  initialValue={minParticipantsValue}
                  max={100}
                  min={0}
                  step={1}
                  onChange={(e) => {
                    if (e.data.value) {
                      setMinParticipantsValue(e.data.value);
                      e.data.form.setItemValue("minParticipants", e.data.value);
                    }
                  }}
                  info={{
                    en: "How many participants are necessary for the activity?",
                    cs: "Kolik účastníků je potřeba na aktivitu aby mohla proběhnout?",
                  }}
                  validateOnChange
                  validationMap={{
                    min: {
                      message: {
                        en: "Minimum number of participants cannot be less than 0",
                        cs: "Minimální počet účastníků nemůže být méně než 0",
                      },
                      feedback: "error",
                    },
                    max: {
                      message: {
                        en: "Minimum number of participants cannot be more than 100",
                        cs: "Minimální počet účastníků nemůže být více než 100",
                      },
                      feedback: "error",
                    },
                    step: {
                      message: {
                        en: "Minimum number of participants must be an integer",
                        cs: "Minimální počet účastníků musí být celé číslo",
                      },
                      feedback: "error",
                    },
                  }}
                />
                <FormNumber
                  name="idealParticipants"
                  label={{ en: "Ideal number of participants", cs: "Ideální počet účastníků" }}
                  iconRight="mdi-account-check"
                  initialValue={initialValues.idealParticipants}
                  max={100}
                  min={minParticipantsValue}
                  step={1}
                  info={{
                    en: "What number of participants is ideal for the activity?",
                    cs: "Kolik účastníků by ideálně mělo přijít?",
                  }}
                  validateOnChange
                  validationMap={{
                    min: {
                      message: {
                        en: `Ideal number of participants should not be less than minimum number of participants (${minParticipantsValue})`,
                        cs: `Ideální počet účastníků by neměl být méně než minimální počet účastníků (${minParticipantsValue})`,
                      },
                      feedback: "warning",
                    },
                    max: {
                      message: {
                        en: "Ideal number of participants cannot be more than 100",
                        cs: "Ideální počet účastníků nemůže být více než 100",
                      },
                      feedback: "error",
                    },
                    step: {
                      message: {
                        en: "Ideal number of participants must be an integer",
                        cs: "Ideální počet účastníků musí být celé číslo",
                      },
                      feedback: "error",
                    },
                  }}
                />
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
export { UpdateActivitySettingsModal };
export default UpdateActivitySettingsModal;
//@@viewOff:exports
