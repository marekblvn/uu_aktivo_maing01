//@@viewOn:imports
import { createVisualComponent, Environment } from "uu5g05";
import { Grid } from "uu5g05-elements";
import { Form } from "uu5g05-forms";
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

  render() {
    //@@viewOn:private
    const uuPlus4UPeopleBaseUri = Environment.get("uu_plus4u5g02_peopleBaseUri");
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Form.View>
        <Grid>
          <PersonalCard.FormSelect name="user" baseUri={uuPlus4UPeopleBaseUri} required />
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
