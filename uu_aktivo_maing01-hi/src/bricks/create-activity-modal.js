//@@viewOn:imports
import { createVisualComponent, Lsi } from "uu5g05";
import Config from "./config/config.js";
import { Grid, Modal, useAlertBus } from "uu5g05-elements";
import { CancelButton, Form, FormNumber, FormText, FormTextArea, SubmitButton } from "uu5g05-forms";
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

const CreateActivityModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateActivityModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ open, onClose, onSubmit }) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();
    //@@viewOff:private

    async function handleSubmit(e) {
      const dtoIn = e.data?.value;
      try {
        await onSubmit(dtoIn);
        onClose();
        addAlert({
          header: {
            en: "New Activity created!",
            cs: "Nová aktivita vytvořena!",
          },
          message: {
            en: `Activity '${dtoIn.name}' was successfully created`,
            cs: `Aktivita '${dtoIn.name}' byla úspěšně vytvořena`,
          },
          priority: "success",
          durationMs: 3000,
        });
      } catch (error) {
        addAlert({ header: "Error", message: error.message, priority: "error", durationMs: 3000 });
        return;
      }
    }

    //@@viewOn:render

    return (
      <Form.Provider onSubmit={handleSubmit}>
        <Modal
          open={open}
          onClose={onClose}
          header={<Lsi lsi={{ en: "Create Activity", cs: "Vytvořit aktivitu" }} />}
          footer={
            <Grid templateColumns={{ xs: "repeat(2, 1fr)", s: "repeat(2, auto)" }} justifyContent={{ s: "end" }}>
              <CancelButton onClick={onClose} />
              <SubmitButton>
                <Lsi lsi={{ en: "Create", cs: "Vytvořit" }} />
              </SubmitButton>
            </Grid>
          }
        >
          <Form.View>
            <div style={{ display: "grid", rowGap: 12, marginBottom: 8, gridTemplateRows: "repeat(4, auto)" }}>
              <FormText
                name="name"
                type="text"
                initialValue=""
                label={{ en: "Name", cs: "Název" }}
                maxLength={48}
                minLength={1}
                required={true}
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
                      cs: "Název nesmí být více než 48 znaků",
                    },
                    feedback: "error",
                  },
                }}
              />
              <FormTextArea
                name="description"
                label={{ en: "Description", cs: "Popis" }}
                maxLength={256}
                minLength={0}
                initialValue=""
                required={false}
                autoResize
                rows={2}
              />
              <FormText
                name="location"
                label={{ en: "Location", cs: "Lokace" }}
                iconLeft="mdi-flag-variant"
                info={{ en: "The location of the activity (e.g. address)", cs: "Lokace aktivity (např. adresa)" }}
                initialValue=""
                required={false}
                maxLength={60}
                minLength={0}
                validateOnChange={true}
              />
              <Grid templateColumns={{ xs: "repeat(1, auto)", s: "repeat(2, auto)" }}>
                <FormNumber
                  name="minParticipants"
                  label={{ en: "Minimum number of participants", cs: "Minimální počet účastníků" }}
                  iconRight="mdi-account-cancel"
                  initialValue={0}
                  placeholder="0"
                  max={1000}
                  min={0}
                  step={1}
                  info={{
                    cs: "Tato hodnota bude použita pro informování členů, zda dostatečný počet členů potvrdil svoji účast",
                    en: "This value will be used to inform members whether a sufficient number of members have confirmed their participation",
                  }}
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
                        en: "Minimum number of participants cannot be more than 1 000",
                        cs: "Minimální počet účastníků nemůže být více než 1 000",
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
                  initialValue={0}
                  placeholder="0"
                  max={1000}
                  min={0}
                  info={{
                    cs: "Tato hodnota bude použita pro informování členů, zda ideální počet členů potvrdil svoji účast",
                    en: "This value will be used to inform members whether an ideal number of members have confirmed their participation",
                  }}
                  validationMap={{
                    min: {
                      message: {
                        en: "Ideal number of participants cannot be less than 0",
                        cs: "Ideální počet účastníků nemůže být méně než 0",
                      },
                      feedback: "error",
                    },
                    max: {
                      message: {
                        en: "Ideal number of participants cannot be more than 1 000",
                        cs: "Ideální počet účastníků nemůže být více než 1 000",
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
            </div>
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { CreateActivityModal };
export default CreateActivityModal;
//@@viewOff:exports
