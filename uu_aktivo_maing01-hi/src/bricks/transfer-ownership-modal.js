//@@viewOn:imports
import { createVisualComponent, Lsi, useSession } from "uu5g05";
import Config from "./config/config.js";
import { CancelButton, Form, FormCheckbox, FormSelect, SubmitButton } from "uu5g05-forms";
import { Grid, Modal } from "uu5g05-elements";
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

const TransferOwnershipModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "TransferOwnershipModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ open, onClose, onSubmit, members }) {
    //@@viewOn:private
    const { identity } = useSession();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Form.Provider onSubmit={onSubmit}>
        <Modal
          open={open}
          onClose={onClose}
          header={<Lsi lsi={{ en: "Transfer activity ownership", cs: "Převést vlastnictví aktivity" }} />}
          footer={
            <Grid templateColumns={{ xs: "repeat(2, 1fr)", s: "repeat(2, auto)" }} justifyContent={{ s: "end" }}>
              <CancelButton onClick={onClose} />
              <SubmitButton colorScheme="warning">
                <Lsi lsi={{ en: "Transfer", cs: "Převést" }} />
              </SubmitButton>
            </Grid>
          }
        >
          <Form.View>
            <Grid templateColumns={{ xs: "100%" }} templateRows={{ xs: "auto auto" }}>
              <FormSelect
                name="uuIdentity"
                label={{ en: "Select new owner", cs: "Vyberte nového vlastníka" }}
                autoFocus
                itemList={members
                  .filter((member) => member !== identity.uuIdentity)
                  .map((member) => ({
                    value: member,
                    children: <PersonItem uuIdentity={member} size="s" />,
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
                  en: "I understand that the transfer of ownership is an irreversible decision and that I will become a normal member and lose access to activity and deadline settings.",
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
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { TransferOwnershipModal };
export default TransferOwnershipModal;
//@@viewOff:exports
