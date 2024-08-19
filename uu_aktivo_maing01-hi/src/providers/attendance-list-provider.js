//@@viewOn:imports
import { createVisualComponent, useDataList } from "uu5g05";
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
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ children, activityId, dateFilter, sort }) {
    //@@viewOn:private
    const filter = { activityId, ...dateFilter };
    Object.keys(filter).forEach((key) => filter[key] === undefined && delete filter[key]);
    const dataObject = useDataList(
      {
        itemIdentifier: "uuIdentity",
        skipInitialLoad: true,
        initialDtoIn: {
          filters: filter,
          sort,
        },
        handlerMap: {
          load: Calls.Attendance.listStatistics,
        },
      },
      [dateFilter, sort],
    );
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
