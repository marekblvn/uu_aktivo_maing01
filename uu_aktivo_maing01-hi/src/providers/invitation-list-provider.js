//@@viewOn:imports
import { createVisualComponent, useDataList, useSession } from "uu5g05";
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

const InvitationListProvider = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "InvitationListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    filters: {},
    pageSize: 10,
  },
  //@@viewOff:defaultProps

  render({ children, filters, pageSize }) {
    //@@viewOn:private
    const dataList = useDataList({
      pageSize: pageSize,
      itemIdentifier: "id",
      initialDtoIn: {
        filters,
      },
      handlerMap: {
        load: Calls.Invitation.list,
      },
      itemHandlerMap: {
        accept: Calls.Invitation.accept,
        delete: Calls.Invitation.delete,
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
export { InvitationListProvider };
export default InvitationListProvider;
//@@viewOff:exports
