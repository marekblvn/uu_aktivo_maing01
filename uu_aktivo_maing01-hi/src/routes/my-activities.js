//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import Config from "./config/config.js";
import RouteBar from "../core/route-bar.js";
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

let MyActivities = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "MyActivities",
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
        <RouteBar />
        <div>Visual Component {MyActivities.uu5Tag}</div>
        {children}
      </div>
    );
    //@@viewOff:render
  },
});

MyActivities = withRoute(MyActivities, { authenticated: true });

//@@viewOn:exports
export { MyActivities };
export default MyActivities;
//@@viewOff:exports
