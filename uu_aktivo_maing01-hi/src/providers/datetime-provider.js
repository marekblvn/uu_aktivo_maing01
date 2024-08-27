//@@viewOn:imports
import { createVisualComponent, useDataObject } from "uu5g05";
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

const DatetimeProvider = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DatetimeProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ datetimeId, children }) {
    //@@viewOn:private
    const dataObject = useDataObject({
      initialDtoIn: { id: datetimeId },
      skipInitialLoad: datetimeId === null,
      handlerMap: {
        load: Calls.Datetime.get,
        updateParticipation: Calls.Datetime.updateParticipation,
        create: Calls.Datetime.create,
        delete: Calls.Datetime.delete,
      },
    });
    const { state, data, errorData, pendingData, handlerMap } = dataObject;
    //@@viewOff:private

    return children({
      state,
      data,
      errorData,
      pendingData,
      handlerMap,
    });
  },
});

//@@viewOn:exports
export { DatetimeProvider };
export default DatetimeProvider;
//@@viewOff:exports
