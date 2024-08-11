//@@viewOn:imports
import { createVisualComponent, useDataObject } from "uu5g05";
import { Error } from "uu_plus4u5g02-elements";
import { Pending } from "uu5g05-elements";
import Config from "./config/config.js";
import Calls from "../calls.js";
import DatetimeDetail from "../bricks/datetime-detail.js";
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

  render({ datetimeId, idealParticipants, minParticipants }) {
    //@@viewOn:private
    const dataObject = useDataObject({
      initialDtoIn: { id: datetimeId },
      handlerMap: {
        load: Calls.Datetime.get,
        updateParticipation: Calls.Datetime.updateParticipation,
      },
    });
    const { state, data, errorData, pendingData, handlerMap } = dataObject;
    //@@viewOff:private

    function renderLoading() {
      return <Pending size="l" colorScheme="secondary" />;
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          return <Error title={errorData.error?.message} subtitle={errorData.error?.code} error={errorData.error} />;
      }
    }

    function renderReady(data) {
      return (
        <DatetimeDetail
          data={data}
          onUpdateParticipation={handlerMap.updateParticipation}
          idealParticipants={idealParticipants}
          minParticipants={minParticipants}
        />
      );
    }

    //@@viewOn:render
    switch (state) {
      case "pending":
        return renderReady(data);
      case "pendingNoData":
        return renderLoading();
      case "error":
      case "errorNoData":
        return renderError(errorData);
      case "ready":
      case "readyNoData":
        return renderReady(data);
    }
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DatetimeProvider };
export default DatetimeProvider;
//@@viewOff:exports
