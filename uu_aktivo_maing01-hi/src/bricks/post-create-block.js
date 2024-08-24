//@@viewOn:imports
import { createVisualComponent, useState } from "uu5g05";
import Config from "./config/config.js";
import { Grid, RichIcon } from "uu5g05-elements";
import { TextArea } from "uu5g05-forms";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: Config.Css.css({}),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const PostCreateBlock = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "PostCreateBlock",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onSubmit: () => {},
    disabled: false,
    inputProps: {},
  },
  //@@viewOff:defaultProps

  render({ onSubmit, disabled, inputProps }) {
    //@@viewOn:private
    const [value, setValue] = useState("");
    //@@viewOff:private

    const handleSubmit = async (e) => {
      e.preventDefault();
      await onSubmit(value);
    };

    const handleChange = ({ data }) => {
      setValue(data.value);
    };

    //@@viewOn:render

    return (
      <Grid
        templateAreas={{
          xs: `
        input input input input input input input input input input btn
        `,
        }}
        style={{
          position: "absolute",
          bottom: 0,
          backgroundColor: "rgb(255,255,255)",
          boxShadow: "0px -6px 5px -5px rgba(0,0,0,0.5)",
          zIndex: 20,
          padding: "8px 8px",
          borderRadius: "8px",
          width: "100%",
        }}
      >
        <Grid.Item gridArea="input" colSpan={10}>
          <TextArea
            name="content"
            rows={1}
            minLength={0}
            maxLength={256}
            validateOnChange
            validationMap={{
              maxLength: {
                feedback: "error",
                message: {
                  en: "Your message is too long!",
                  cs: "Vaše zpráva je moc dlouhá!",
                },
              },
            }}
            autoResize={false || inputProps.autoResize}
            style={{ width: "100%", resize: "none !important" }}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            placeholder={{ en: "Type something...", cs: "Napište něco..." }}
            {...inputProps}
          />
        </Grid.Item>
        <Grid.Item gridArea="btn" colSpan={1}>
          <RichIcon
            icon="uugds-send"
            colorScheme="primary"
            significance="subdued"
            borderRadius="moderate"
            disabled={disabled || !value || value?.length === 0 || value?.length > 256}
            onClick={handleSubmit}
          />
        </Grid.Item>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { PostCreateBlock };
export default PostCreateBlock;
//@@viewOff:exports
