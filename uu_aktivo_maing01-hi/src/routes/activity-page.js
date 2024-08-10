//@@viewOn:imports
import { createVisualComponent, Lsi, PropTypes, useRoute, useScreenSize } from "uu5g05";
import { Pending, PlaceholderBox } from "uu5g05-elements";
import { Error } from "uu_plus4u5g02-elements";
import Config from "./config/config.js";
import { withRoute } from "uu_plus4u5g02-app";
import Container from "../bricks/container.js";
import ActivityProvider from "../providers/activity-provider.js";
import ActivityDetail from "../bricks/activity-detail.js";
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

let ActivityPage = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityPage",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    id: PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    id: "",
  },
  //@@viewOff:defaultProps

  render({ id }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const [, setRoute] = useRoute();
    //@@viewOff:private

    function renderLoading() {
      return <Pending size="max" colorScheme="primary" />;
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          return <Error title={errorData.error?.message} subtitle={errorData.error?.code} error={errorData.error} />;
      }
    }

    function renderReady(data, handlerMap) {
      if (!data || Object.keys(data).length === 0) {
        return (
          <PlaceholderBox
            code="smile-sad"
            header={{ en: "Something's not right.", cs: "Něco tu nehraje." }}
            info={{ en: "That activity does not exist.", cs: "Tato aktivita neexistuje." }}
            actionList={[
              {
                children: <Lsi lsi={{ en: "Back to home page", cs: "Zpátky na hlavní stránku" }} />,
                icon: "mdi-home",
                colorScheme: "steel",
                significance: "common",
                onClick: () => setRoute(""),
              },
            ]}
            style={{ marginTop: "10%" }}
          />
        );
      }
      return <ActivityDetail data={data} />;
    }

    //@@viewOn:render
    return (
      <Container style={{ width: `${["xs", "s"].includes(screenSize) ? "100%" : "90%"}`, marginTop: "32px" }}>
        <ActivityProvider activityId={id}>
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
                return renderReady(data, handlerMap);
            }
          }}
        </ActivityProvider>
      </Container>
    );
    //@@viewOff:render
  },
});

ActivityPage = withRoute(ActivityPage, { authenticated: true });

//@@viewOn:exports
export { ActivityPage };
export default ActivityPage;
//@@viewOff:exports
