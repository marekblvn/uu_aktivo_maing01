//@@viewOn:imports
import { createVisualComponent, useCall, useEffect, useRef, useState } from "uu5g05";
import Config from "./config/config.js";
import { Grid, Line } from "uu5g05-elements";
import { Form, FormNumber, FormSelect, FormText, FormTextArea, FormTextSelect, Radios, useFormApi } from "uu5g05-forms";
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

const CreateActivityForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateActivityForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({}) {
    //@@viewOn:private
    const { call: personalCardLoad, state, data, errorData } = useCall(Calls.loadPersonalCard);
    const emailList = useRef([]);
    const [showEmailSelect, setShowEmailSelect] = useState(false);
    //@@viewOff:private
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

    //@@viewOn:render
    return (
      <Form.View>
        <Grid templateRows={{ xs: "repeat(4,auto)" }} rowGap={12}>
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
              iconLeft="mdi-account-cancel"
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
              iconLeft="mdi-account-check"
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
          <Line colorScheme="neutral" significance="subdued" />
          <Radios
            box={false}
            label={{
              en: "Would you like to receive email notifications about datetime from this activity? ",
              cs: "Chcete dostávat upozornění na email ohledně termínu v této aktivitě?",
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
              info={{
                en: "You can enter a custom email address. The email address can be changed later.",
                cs: "Můžete zadat jinou emailovou adresu. Adresu můžete později změnit.",
              }}
              itemList={emailList.current}
              initialValue={emailList.current.length > 0 ? emailList.current[0].value : undefined}
              insertable
              iconLeft="mdi-at"
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
  }, //@@viewOff:render
});
//@@viewOn:exports
export { CreateActivityForm };
export default CreateActivityForm;
//@@viewOff:exports
