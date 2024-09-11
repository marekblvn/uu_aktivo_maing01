//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import Config from "./config/config.js";
import { Form, FormCheckbox, FormSelect } from "uu5g05-forms";
import { Grid } from "uu5g05-elements";
import { PersonItem } from "uu_plus4u5g02-elements";
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

const TransferOwnershipForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "TransferOwnershipForm",
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
        <Grid templateColumns={{ xs: "100%" }} templateRows={{ xs: "auto auto" }}>
          <FormSelect
            name="uuIdentity"
            label={{ en: "Select new owner", cs: "Vyberte nového vlastníka" }}
            autoFocus
            itemList={members.map((member) => ({
              value: member.uuIdentity,
              children: <PersonItem uuIdentity={member.uuIdentity} size="s" />,
            }))}
            required
            validationMap={{
              required: {
                feedback: "error",
                message: {
                  en: "Please select the new owner.",
                  cs: "Prosím vyberte nového vlastníka.",
                },
              },
            }}
          />
          <FormCheckbox
            name="consent"
            box={false}
            label={{
              en: "I understand that the transfer of ownership is an irreversible decision and that I will become a normal member and lose access to activity and datetime settings.",
              cs: "Beru na vědomí, že převod vlastnictví je nevratné rozhodnutí a že se tak stanu normálním členem a ztratím přístup k nastavením aktivity a termínu.",
            }}
            required
            validationMap={{
              required: {
                feedback: "error",
                message: {
                  en: "Please confirm that you understand that this decision is irreversible a will have impact on your position in the activity.",
                  cs: "Prosím potvrďte, že rozumíte, že toto rozhodnutí je permanentní a ovlivní vaši pozici v rámci aktivity.",
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
export { TransferOwnershipForm };
export default TransferOwnershipForm;
//@@viewOff:exports
