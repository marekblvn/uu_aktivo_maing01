//@@viewOn:imports
import { createVisualComponent, Lsi, Utils } from "uu5g05";
import { Grid, Modal } from "uu5g05-elements";
import { CancelButton, Form, FormText, SubmitButton } from "uu5g05-forms";
import { PersonalCard } from "uu_plus4upeopleg01-forms";
import Config from "./config/config.js";
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

const CreateInvitationModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateInvitationModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ open, onClose, onSubmit, members }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Form.Provider onSubmit={onSubmit}>
        <Modal
          open={open}
          onClose={onClose}
          header={<Lsi lsi={{ en: "Create invitation", cs: "Vytvořit pozvánku" }} />}
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
            <Grid>
              {/* <PersonalCard.FormSelect disabled={true} /> */}
              <FormText
                iconLeft="mdi-account-search"
                name="uuIdentity"
                label={{ en: "User's Plus4U ID", cs: "Plus4U ID uživatele" }}
                required
                pattern="^\d{1,5}-\d{1,5}-\d{1,5}$"
                onValidate={async (e) => {
                  if (members.includes(e.data.value)) {
                    return {
                      feedback: "error",
                      message: {
                        en: "This user is already a member of this activity.",
                        cs: "Tento uživatel už je členem této aktivity.",
                      },
                    };
                  }
                }}
                validationMap={{
                  required: {
                    feedback: "error",
                    message: {
                      en: "Please enter Plus4U ID of the user you want to invite.",
                      cs: "Zadejte prosím Plus4U ID uživatele, kterého chcete pozvat.",
                    },
                  },
                  pattern: {
                    feedback: "error",
                    message: {
                      en: "User's Plus4U ID must be in a correct format.",
                      cs: "Plus4U ID musí být ve správném formátu.",
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
export { CreateInvitationModal };
export default CreateInvitationModal;
//@@viewOff:exports
