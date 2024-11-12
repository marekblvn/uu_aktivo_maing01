//@@viewOn:imports
import { createVisualComponent, PropTypes, useCall, useEffect, useRef, useState } from "uu5g05";
import Config from "./config/config.js";
import { Form, FormRadios, FormTextSelect } from "uu5g05-forms";
import { Grid } from "uu5g05-elements";
import Calls from "../calls.js";
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

const UpdateEmailForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdateEmailForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    initialValues: PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    initialValues: {},
  },
  //@@viewOff:defaultProps

  render({ initialValues }) {
    //@@viewOn:private
    const { call: personalCardLoad, state, data, errorData } = useCall(Calls.loadPersonalCard);
    const emailList = useRef([]);
    const [showEmailSelect, setShowEmailSelect] = useState(initialValues.email !== null);

    useEffect(() => {
      const load = async () => {
        await personalCardLoad();
      };
      load();
    }, []);

    if (state === "ready") {
      const emails = data.contactMap?.emailList?.map((email) => ({ value: email.value })) || [];
      emailList.current = emails;
    }

    const initialEmail = initialValues.email || emailList.current[0]?.value || undefined;
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Form.View>
        <Grid>
          <FormRadios
            box={false}
            label={{
              en: `Do you ${initialValues.email === null ? "" : "still"} want to receive email notifications from this activity?`,
              cs: `Chcete ${initialValues.email === null ? "" : "nadále"} dostávat upozornění na email ohledně termínu v této aktivitě?`,
            }}
            itemList={[
              {
                value: true,
                children: {
                  en: "Yes — I want to receive email notifications.",
                  cs: "Ano — chci dostávat upozornění na email.",
                },
              },
              {
                value: false,
                children: {
                  en: "No — I don't want to receive email notifications.",
                  cs: "Ne — nechci dostávat upozornění na email.",
                },
              },
            ]}
            onChange={(e) => setShowEmailSelect(e.data.value)}
            initialValue={showEmailSelect}
            value={showEmailSelect}
          />
          {showEmailSelect && (
            <FormTextSelect
              required
              name="email"
              label={{ en: "Email address to send notifications to", cs: "Emailová adresa pro posílání upozornění" }}
              placeholder={{
                en: "Please choose an address from list or enter a custom one",
                cs: "Vyberte prosím adresu ze seznamu nebo zadejte jinou",
              }}
              itemList={emailList.current}
              initialValue={initialEmail}
              iconLeft="mdi-at"
              insertable
              validateOnMount
              onValidate={(e) => {
                if (e.data.value !== undefined) {
                  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.data.value);
                  if (!isValidEmail) {
                    return {
                      code: "invalidEmail",
                      feedback: "error",
                      message: { en: "Invalid email address format.", cs: "Neplatný formát e-mailové adresy." },
                    };
                  }
                }
              }}
              lsi={{
                noItems: {
                  en: "No emails found.",
                  cs: "Nebyly nalezeny žádné emaily",
                },
              }}
            />
          )}
        </Grid>
      </Form.View>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { UpdateEmailForm };
export default UpdateEmailForm;
//@@viewOff:exports
