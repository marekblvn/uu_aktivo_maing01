//@@viewOn:imports
import { createVisualComponent, useDataList, useSession, Utils } from "uu5g05";
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

const ActivityListProvider = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ children }) {
    //@@viewOn:private
    const { identity } = useSession();
    const dataList = useDataList({
      pageSize: 10,
      itemIdentifier: "id",
      initialDtoIn: {
        filters: {
          members: [identity.uuIdentity],
        },
      },
      handlerMap: {
        load: Calls.Activity.list,
        create: Calls.Activity.create,
      },
      itemHandlerMap: {
        leave: Calls.Activity.leave,
        delete: Calls.Activity.delete,
      },
    });
    let { state, data, errorData, pendingData, handlerMap } = dataList;
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
export { ActivityListProvider };
export default ActivityListProvider;
//@@viewOff:exports
