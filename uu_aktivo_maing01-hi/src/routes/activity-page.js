//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils } from "uu5g05";
import Config from "./config/config.js";
import { withRoute } from "uu_plus4u5g02-app";
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

let ActivityPage = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityPage",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    id: PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    id: "",
  },
  //@@viewOff:defaultProps

  render({ id, ...props }) {
    //@@viewOn:private
    const { children } = props;
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props, Css.main(props));

    return (
      <div {...attrs}>
        <div>Visual Component {ActivityPage.uu5Tag}</div>
        <div>{id ? `id: ${id}` : "no id"}</div>
        {children}
      </div>
    );
    //@@viewOff:render
  },
});

ActivityPage = withRoute(ActivityPage, { authenticated: true });

//@@viewOn:exports
export { ActivityPage };
export default ActivityPage;
//@@viewOff:exports
