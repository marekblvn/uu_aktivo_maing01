//@@viewOn:imports
import { createVisualComponent, useDataList } from "uu5g05";
import Config from "./config/config.js";
import Calls from "../calls.js";
import { Grid, Pending, useAlertBus } from "uu5g05-elements";
import { Error } from "uu_plus4u5g02-elements";
import PostList from "../bricks/post-list.js";
//@@viewOff:imports

//@@viewOn:constants
const PAGE_SIZE = 10;
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
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ activityId }) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();
    const dataList = useDataList({
      pageSize: PAGE_SIZE,
      itemIdentifier: "id",
      initialDtoIn: {
        activityId: activityId,
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

    const handleCreatePost = async (value) => {
      try {
        await handlerMap.create({ activityId, type: "normal", content: value });
        await handlerMap.load({ activityId });
      } catch (error) {
        addAlert({ priority: "error" });
      }
    };

    function renderLoading() {
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Pending size="xl" type="horizontal" colorScheme="secondary" />
        </div>
      );
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
        <Grid templateRows="10fr auto" rowGap={0} style={{ maxHeight: "655px", borderRadius: "8px" }}>
          <PostList data={data} onPostCreate={handleCreatePost} />
        </Grid>
      );
    }

    //@@viewOn:render
    switch (state) {
      case "pending":
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
export { PostListProvider };
export default PostListProvider;
//@@viewOff:exports
