//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize, Utils } from "uu5g05";
import Config from "./config/config.js";
import { Error, withRoute } from "uu_plus4u5g02-app";
import PageHeader from "../bricks/page-header.js";
import Container from "../bricks/container.js";
import ActivityListProvider from "../providers/activity-list-provider.js";
import { Pending } from "uu5g05-elements";
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

let MyActivities = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "MyActivities",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props, Css.main(props));

    function renderLoading() {
      return <Pending size="max" colorScheme="primary" />;
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          return (
            <Error
              title={errorData.error?.message}
              subtitle={"/" + errorData.error?.code.split("/").at(-1)}
              error={errorData.error}
            />
          );
      }
    }

    function renderReady(data) {
      console.log(data);
      return <div>ready</div>;
    }

    return (
      <Container {...attrs} style={{ width: `${["xs", "s"].includes(screenSize) ? "95%" : "80%"}`, marginTop: "32px" }}>
        <PageHeader content={<Lsi lsi={{ en: "My Activities", cs: "Moje aktivity" }} />} />
        <ActivityListProvider>
          {({ state, data, errorData, pendingData, handlerMap }) => {
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
          }}
        </ActivityListProvider>
      </Container>
    );
    //@@viewOff:render
  },
});

MyActivities = withRoute(MyActivities, { authenticated: true });

//@@viewOn:exports
export { MyActivities };
export default MyActivities;
//@@viewOff:exports
