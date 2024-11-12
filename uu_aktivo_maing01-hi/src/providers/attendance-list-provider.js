//@@viewOn:imports
import { createVisualComponent, PropTypes, useDataList } from "uu5g05";
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

const AttendanceListProvider = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AttendanceListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    children: PropTypes.func,
    filters: PropTypes.object,
    sort: PropTypes.object,
    pageSize: PropTypes.number,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    children: () => {},
    filters: {},
    sort: {},
    pageSize: 50,
  },
  //@@viewOff:defaultProps

  render({ children, filters, pageSize, sort }) {
    //@@viewOn:private
    const dataObject = useDataList({
      pageSize,
      itemIdentifier: "id",
      initialDtoIn: {
        filters,
        sort,
      },
      handlerMap: {
        load: Calls.Attendance.list,
        deleteBulk: Calls.Attendance.deleteBulk,
      },
      itemHandlerMap: {
        delete: Calls.Attendance.delete,
        get: Calls.Attendance.get,
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
export { AttendanceListProvider };
export default AttendanceListProvider;
//@@viewOff:exports
