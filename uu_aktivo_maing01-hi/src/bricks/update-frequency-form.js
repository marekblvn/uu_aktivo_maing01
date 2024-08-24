//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import Config from "./config/config.js";
import { Form, FormSelect } from "uu5g05-forms";
import { Grid } from "uu5g05-elements";
import { getFrequencyOption, limitedFrequencyOptions } from "../../utils/frequency-utils.js";
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

const UpdateFrequencyForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdateFrequencyForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ initialValues, notificationOffset }) {
    //@@viewOn:private
    const initialOption = getFrequencyOption(initialValues);
    //@@viewOff:private
    //@@viewOn:render
    return (
      <Form.View>
        <Grid templateColumns={{ xs: "100%" }} alignItems={"start"}>
          <FormSelect
            name="frequency"
            label={{ en: "Datetime recurrence frequency", cs: "Frekvence opakování termínu" }}
            required
            itemList={limitedFrequencyOptions(notificationOffset)}
            initialValue={initialOption?.value}
            validationMap={{
              badValue: {
                feedback: "error",
                message: {
                  en: "Bad frequency value, please select one of the options.",
                  cs: "Špatná hodnota frekvence, vyberte prosím jednu z možností.",
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
export { UpdateFrequencyForm };
export default UpdateFrequencyForm;
//@@viewOff:exports
