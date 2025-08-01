//@@viewOn:imports
import { createVisualComponent, PropTypes, useDataObject } from "uu5g05";
import Config from "./config/config.js";
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

const ActivityProvider = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    activityId: PropTypes.string,
    children: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    activityId: "",
    children: () => {},
  },
  //@@viewOff:defaultProps

  render({ activityId, children }) {
    //@@viewOn:private
    let dataObject = useDataObject({
      initialDtoIn: { id: activityId },
      handlerMap: {
        load: Calls.Activity.get,
        update: Calls.Activity.update,
        updateFrequency: Calls.Activity.updateFrequency,
        updateNotificationOffset: Calls.Activity.updateNotificationOffset,
        delete: Calls.Activity.delete,
        addAdministrator: Calls.Activity.addAdministrator,
        removeAdministrator: Calls.Activity.removeAdministrator,
        removeMember: Calls.Activity.removeMember,
        leave: Calls.Activity.leave,
        transferOwnership: Calls.Activity.transferOwnership,
        updateEmail: Calls.Activity.updateEmail,
      },
    });

    let { state, data, errorData, pendingData, handlerMap } = dataObject;
    //@@viewOff:private

    //@@viewOn:render
    return children({
      state,
      data,
      errorData,
      pendingData,
      handlerMap,
    });
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityProvider };
export default ActivityProvider;
//@@viewOff:exports
