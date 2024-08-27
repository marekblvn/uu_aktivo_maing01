//@@viewOn:imports
import { createVisualComponent, Lsi } from "uu5g05";
import Config from "./config/config.js";
import { Form, FormRadios, FormTextArea } from "uu5g05-forms";
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

const UpdatePostForm = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdatePostForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    initialValues: {},
  },
  //@@viewOff:defaultProps

  render({ initialValues }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Form.View>
        <div style={{ display: "grid", rowGap: 12, marginBottom: 8, gridTemplateRows: "repeat(2, auto)" }}>
          <FormTextArea
            name="content"
            label={{ en: "Content", cs: "Obsah" }}
            maxLength={256}
            minLength={1}
            initialValue={initialValues.content}
            autoResize
            rows={2}
            spellCheck
            required
            validationMap={{
              required: {
                message: { en: "Post must have some content.", cs: "Příspěvek musí mít nějaký obsah." },
                feedback: "error",
              },
              maxLength: {
                message: {
                  en: "Post content cannot be longer than 256 characters.",
                  cs: "Obsah příspěvku nesmí přesáhnout délku 256 znaků.",
                },
                feedback: "error",
              },
            }}
          />
          <FormRadios
            name="type"
            label={{ en: "Type", cs: "Typ" }}
            initialValue={initialValues.type}
            itemList={[
              {
                value: "normal",
                children: <Lsi lsi={{ en: "Normal", cs: "Normální" }} />,
              },
              {
                value: "important",
                children: <Lsi lsi={{ en: "Important", cs: "Důležitý" }} />,
              },
            ]}
          />
        </div>
      </Form.View>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { UpdatePostForm };
export default UpdatePostForm;
//@@viewOff:exports
