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

const PostListProvider = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "PostListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    filters: PropTypes.object,
    sort: PropTypes.object,
    pageSize: PropTypes.number,
    children: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    filters: {},
    sort: {},
    pageSize: 50,
    children: () => {},
  },
  //@@viewOff:defaultProps

  render({ children, filters, sort, pageSize }) {
    //@@viewOn:private
    const dataList = useDataList({
      pageSize,
      itemIdentifier: "id",
      initialDtoIn: {
        filters,
        sort,
      },
      handlerMap: {
        load: Calls.Post.list,
        create: Calls.Post.create,
      },
      itemHandlerMap: {
        update: Calls.Post.update,
        delete: Calls.Post.delete,
      },
    });
    let { state, data, errorData, pendingData, handlerMap } = dataList;
    //@@viewOff:private

    //@@viewOn:render
    return children({ state, data, errorData, pendingData, handlerMap });
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { PostListProvider };
export default PostListProvider;
//@@viewOff:exports
