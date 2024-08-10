//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
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

const ActivityInformationView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityInformationView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    description: "",
    location: "",
    activityId: "",
  },
  //@@viewOff:defaultProps

  render({ description, location, activityId }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return <div>Activity Information</div>;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityInformationView };
export default ActivityInformationView;
//@@viewOff:exports
