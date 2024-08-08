//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useRef, useScreenSize, useSession, useState } from "uu5g05";
import Config from "./config/config.js";
import { Error, withRoute } from "uu_plus4u5g02-app";
import Container from "../bricks/container.js";
import ActivityListProvider from "../providers/activity-list-provider.js";
import { ActionGroup, Dialog, Header, Icon, Pending, PlaceholderBox, RichIcon, useAlertBus } from "uu5g05-elements";
import ActivityList from "../bricks/activity-list.js";
import CreateActivityModal from "../bricks/create-activity-modal.js";
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
    const createActivityRef = useRef();
    const [dialogProps, setDialogProps] = useState();
    const [openModal, setOpenModal] = useState(false);
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
      if (!data.length) {
        return (
          <PlaceholderBox
            code="items"
            header={{ en: "You are not a member of any activity", cs: "Nejste členem žádné aktivity" }}
            info={{
              en: "Once you accept an invitation to an activity, or create your own activity, it will be shown here.",
              cs: "Jakmile přijmete pozvánku do aktivity, nebo si vytvoříte vlastní aktivitu, najdete ji zde.",
            }}
            actionList={[
              {
                children: <Lsi lsi={{ en: "Create Activity", cs: "Vytvořit aktivitu" }} />,
                primary: true,
                colorScheme: "primary",
                significance: "common",
                onClick: () => setOpenModal(true),
              },
            ]}
          />
        );
      }
      return <ActivityList itemList={data} onActivityLeave={handleLeaveActivity} />;
    }

    return (
      <>
        <Container style={{ width: `${["xs", "s"].includes(screenSize) ? "100%" : "90%"}`, marginTop: "32px" }}>
          <div style={{ display: "flex" }}>
            <Header
              title={<Lsi lsi={{ en: "My Activities", cs: "Moje aktivity" }} />}
              icon={
                <RichIcon
                  icon="mdi-lightning-bolt"
                  colorScheme="orange"
                  significance="subdued"
                  borderRadius="moderate"
                  cssBackground="#f9f9f9"
                  size={screenSize === "xs" ? "l" : "xl"}
                />
              }
              level={4}
              style={{ marginLeft: `${["xs", "s"].includes(screenSize) ? "6px" : "0"}` }}
            />
            <ActionGroup
              itemList={[
                {
                  children: <Lsi lsi={{ en: "Create new Activity", cs: "Vytvořit novou aktivitu" }} />,
                  colorScheme: "primary",
                  significance: "common",
                  onClick: () => setOpenModal(true),
                  order: -1,
                  icon: "mdi-plus",
                  collapsed: false,
                  size: screenSize,
                },
              ]}
              collapsedMenuProps={{
                colorScheme: "primary",
                significance: "common",
              }}
            />
          </div>
          <ActivityListProvider>
            {({ state, data, errorData, pendingData, handlerMap }) => {
              reloadRef.current = handlerMap.load;
              createActivityRef.current = handlerMap.create;
              console.log(state);
              console.log(data);
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
          <CreateActivityModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSubmit={createActivityRef.current}
          />
        </Container>
      </>
    );
    //@@viewOff:render
  },
});

MyActivities = withRoute(MyActivities, { authenticated: true });

//@@viewOn:exports
export { MyActivities };
export default MyActivities;
//@@viewOff:exports
