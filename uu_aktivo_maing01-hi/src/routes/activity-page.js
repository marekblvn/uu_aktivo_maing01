//@@viewOn:imports
import { createVisualComponent, Lsi, PropTypes, useLsi, useRoute, useScreenSize } from "uu5g05";
import { Pending, PlaceholderBox } from "uu5g05-elements";
import { Error } from "uu_plus4u5g02-elements";
import Config from "./config/config.js";
import { withRoute } from "uu_plus4u5g02-app";
import Container from "../bricks/container.js";
import ActivityProvider from "../providers/activity-provider.js";
import ActivityDetail from "../bricks/activity-detail.js";
import { ActivityAuthorizationContextProvider } from "../contexts/activity-authorization-context.js";
import importLsi from "../lsi/import-lsi.js";
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
    const placeholderLsi = useLsi({ import: importLsi, path: ["Placeholder", "noActivity"] });
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    //@@viewOff:private

    function renderLoading() {
      return <Pending size="max" colorScheme="primary" />;
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          const errorCode = errorData.error?.code;
          return (
            <Error
              title={errorLsi[errorCode]?.header || { en: "Something went wrong", cs: "Něco se pokazilo" }}
              subtitle={errorLsi[errorCode]?.message || errorData.error?.code}
              error={errorData.error}
            />
          );
      }
    }

    function renderReady(data, handlerMap) {
      if (!data || Object.keys(data).length === 0) {
        return (
          <PlaceholderBox
            code="smile-sad"
            header={placeholderLsi.info}
            info={placeholderLsi.info}
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
      return (
        <ActivityAuthorizationContextProvider activity={data}>
          <ActivityDetail data={data} handlerMap={handlerMap} />
        </ActivityAuthorizationContextProvider>
      );
    }

    //@@viewOn:render
    return (
      <Container
        style={{
          width: `${["xs", "s"].includes(screenSize) ? "100%" : "90%"}`,
          marginTop: "32px",
        }}
      >
        <ActivityProvider activityId={id}>
          {({ state, data, errorData, pendingData, handlerMap }) => {
            switch (state) {
              case "pending":
                return renderReady(data, handlerMap);
              case "pendingNoData":
                return renderLoading();
              case "error":
                return renderReady(data, handlerMap);
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
