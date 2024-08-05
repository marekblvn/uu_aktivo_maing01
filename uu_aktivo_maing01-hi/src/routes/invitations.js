//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
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

let Invitations = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Invitations",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { children } = props;
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props, Css.main(props));

    return (
      <div {...attrs}>
        <div>Visual Component {Invitations.uu5Tag}</div>
        {children}
      </div>
    );
    //@@viewOff:render
  },
});

Invitations = withRoute(Invitations, { authenticated: true });

//@@viewOn:exports
export { Invitations };
export default Invitations;
//@@viewOff:exports
