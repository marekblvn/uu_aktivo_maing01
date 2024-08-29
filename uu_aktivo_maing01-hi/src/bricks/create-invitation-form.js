//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { Grid } from "uu5g05-elements";
import { Form, FormText } from "uu5g05-forms";
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

const CreateInvitationForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateInvitationForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ members }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Form.View>
        <Grid>
          {/* <PersonalCard.FormSelect disabled={true} /> */}
          <FormText
            iconLeft="mdi-account-search"
            name="uuIdentity"
            label={{ en: "User's Plus4U ID", cs: "Plus4U ID uživatele" }}
            required
            pattern="^\d{1,4}(-\d{1,4}){1,3}$"
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
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { CreateInvitationForm };
export default CreateInvitationForm;
//@@viewOff:exports
