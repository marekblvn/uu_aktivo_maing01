//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useRef, useScreenSize, useSession, useState } from "uu5g05";
import Config from "./config/config.js";
import { Error, withRoute } from "uu_plus4u5g02-app";
import Container from "../bricks/container.js";
import ActivityListProvider from "../providers/activity-list-provider.js";
import { Dialog, Header, Icon, Pending, useAlertBus } from "uu5g05-elements";
import ActivityList from "../bricks/activity-list.js";
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
    const { identity } = useSession();
    const { addAlert } = useAlertBus();
    const reloadRef = useRef();
    const [dialogProps, setDialogProps] = useState();
    //@@viewOff:private

    //@@viewOn:methods
    const showDialog = useCallback((onConfirm) => {
      setDialogProps({
        header: (
          <Lsi
            lsi={{ en: "Are you sure you want to leave this activity?", cs: "Opravdu chcete opustit tuto aktivitu?" }}
          />
        ),
        icon: "mdi-exit-run",
        info: (
          <Lsi lsi={{ en: "This will make you lose access to the activity.", cs: "Ztratíte přístup do aktivity." }} />
        ),
        actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
        actionList: [
          {
            children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
            onClick: (e) => {
              e.preventDefault();
              setDialogProps(null);
            },
          },
          {
            children: <Lsi lsi={{ en: "Leave", cs: "Odejít" }} />,
            onClick: async (e) => {
              e.preventDefault();
              try {
                await onConfirm();
                setDialogProps(null);
                reloadRef.current({ filters: { members: [identity.uuIdentity] } });
              } catch (error) {
                addAlert({ header: "Error!", message: error.message, priority: "error" });
                return;
              }
            },
            colorScheme: "negative",
            significance: "highlighted",
          },
        ],
      });
    }, []);

    const handleLeaveActivity = useCallback(
      (item) => {
        showDialog(async () => {
          return await item.handlerMap.leave(item.data.id);
        });
      },
      [showDialog],
    );
    //@@viewOff:methods

    //@@viewOn:render
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
      return <ActivityList itemList={data} onActivityLeave={handleLeaveActivity} />;
    }

    return (
      <Container style={{ width: `${["xs", "s"].includes(screenSize) ? "100%" : "90%"}`, marginTop: "32px" }}>
        <Header
          title={<Lsi lsi={{ en: "My Activities", cs: "Moje aktivity" }} />}
          icon={<Icon icon="mdi-star" colorScheme="primary" significance="common" />}
          level={4}
          style={{ marginLeft: `${["xs", "s"].includes(screenSize) ? "6px" : "0"}` }}
        />
        <ActivityListProvider>
          {({ state, data, errorData, pendingData, handlerMap }) => {
            reloadRef.current = handlerMap.load;
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
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
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
