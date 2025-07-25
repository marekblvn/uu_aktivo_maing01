//@@viewOn:imports
import { createVisualComponent, PropTypes } from "uu5g05";
import { Modal } from "uu5g05-elements";
import { Form } from "uu5g05-forms";
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

const FormModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "FormModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    children: PropTypes.node,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    open: false,
    onClose: () => {},
    onSubmit: () => {},
    children: null,
  },
  //@@viewOff:defaultProps

  render({ open, onClose, onSubmit, children, ...props }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Form.Provider onSubmit={onSubmit}>
        <Modal open={open} onClose={onClose} {...props}>
          {children}
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { FormModal };
export default FormModal;
//@@viewOff:exports
