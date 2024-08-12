//@@viewOn:imports
import { createVisualComponent, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import { Box, Grid, RichIcon } from "uu5g05-elements";
import { TextArea } from "uu5g05-forms";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  box: (props) =>
    Config.Css.css({
      padding: "8px",
      borderRadius: "8px",
      display: "flex",
    }),
  grid: () =>
    Config.Css.css({
      width: "100%",
      alignItems: "center",
    }),
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
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ onSubmit }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const [value, setValue] = useState("");

    const size = (() => {
      switch (screenSize) {
        case "xl":
        case "l":
        case "m":
          return "m";
        default:
          return screenSize;
      }
    })();
    //@@viewOff:private

    const handleSubmit = async (e) => {
      e.preventDefault();
      await onSubmit(value);
    };

    const handleChange = ({ data }) => {
      if (data.value?.length > 256) return;
      setValue(data.value);
    };

    //@@viewOn:render

    return (
      <Box className={Css.box()}>
        <Grid templateRows="1fr" templateColumns="1fr auto" className={Css.grid()}>
          <TextArea
            minLength={1}
            maxLength={512}
            rows={3}
            maxRows={3}
            size={size}
            spellCheck
            name="content"
            value={value}
            placeholder={{ en: "Type something...", cs: "Napište něco..." }}
            onChange={handleChange}
            style={{ height: "100%" }}
          />
          <RichIcon
            icon="mdi-send"
            colorScheme="primary"
            significance="highlighted"
            size={size}
            style={{ paddingTop: "2px", paddingLeft: "1px" }}
            onClick={handleSubmit}
            disabled={value === ""}
          />
        </Grid>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { PostCreateBlock };
export default PostCreateBlock;
//@@viewOff:exports
