//@@viewOn:imports
import {
  AutoLoad,
  createVisualComponent,
  Lsi,
  useCallback,
  useLsi,
  useRef,
  useScreenSize,
  useSession,
  useState,
} from "uu5g05";
import Config from "./config/config.js";
import { Error, withRoute } from "uu_plus4u5g02-app";
import Container from "../bricks/container.js";
import ActivityListProvider from "../providers/activity-list-provider.js";
import { ActionGroup, Dialog, Header, Pending, PlaceholderBox, RichIcon } from "uu5g05-elements";
import ActivityList from "../bricks/activity-list.js";
import CreateActivityModal from "../bricks/create-activity-modal.js";
import importLsi from "../lsi/import-lsi.js";
import { useAlertBus } from "uu_plus4u5g02-elements";
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
    const { showError } = useAlertBus({ import: importLsi, path: ["Error"] });
    const loadRef = useRef();
    const createActivityRef = useRef();
    const loadNextRef = useRef();
    const [dialogProps, setDialogProps] = useState();
    const [openModal, setOpenModal] = useState(false);
    const [headerButtonVisible, setHeaderButtonVisible] = useState(false);
    const placeholderLsi = useLsi({ import: importLsi, path: ["Placeholder", "noActivityList"] });
    //@@viewOff:private

    //@@viewOn:methods
    const showDialog = useCallback((onConfirm) => {
      setDialogProps({
        header: <Lsi import={importLsi} path={["Dialog", "leaveActivity", "header"]} />,
        icon: "mdi-exit-run",
        info: <Lsi import={importLsi} path={["Dialog", "leaveActivity", "info"]} />,
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
            children: <Lsi import={importLsi} path={["Dialog", "leaveActivity", "submit"]} />,
            onClick: async (e) => {
              e.preventDefault();
              try {
                await onConfirm();
                setDialogProps(null);
                loadRef.current({ filters: { members: [identity.uuIdentity] } });
              } catch (error) {
                showError(error);
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

    const hideHeaderButton = () => setHeaderButtonVisible(false);
    const showHeaderButton = () => setHeaderButtonVisible(true);
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

    function renderReady(data, handlerMap) {
      if (!data.length) {
        hideHeaderButton();
        return (
          <PlaceholderBox
            code="items"
            header={placeholderLsi.header}
            info={placeholderLsi.info}
            actionList={[
              {
                children: <Lsi lsi={{ en: "Create new activity", cs: "Vytvořit novou aktivitu" }} />,
                primary: true,
                icon: "mdi-plus",
                colorScheme: "primary",
                significance: "common",
                onClick: () => setOpenModal(true),
              },
            ]}
            style={{ marginTop: "10%" }}
          />
        );
      }

      showHeaderButton();
      return (
        <>
          <ActivityList itemList={data} onActivityLeave={handleLeaveActivity} />
          <AutoLoad data={data} handleLoadNext={handlerMap.loadNext} distance={window.innerHeight} />
        </>
      );
    }

    return (
      <Container
        style={{
          width: `${["xs", "s"].includes(screenSize) ? "100%" : "90%"}`,
          height: "calc(100vh - 88px)",
          marginTop: "32px",
        }}
      >
        <div style={{ display: "flex", marginBottom: "24px", padding: "0 8px" }}>
          <Header
            title={<Lsi lsi={{ en: "My Activities", cs: "Moje aktivity" }} />}
            icon={
              <RichIcon
                icon="mdi-pulse"
                colorScheme="primary"
                significance="subdued"
                borderRadius="moderate"
                cssBackground="#ffffff"
                size={screenSize === "xs" ? "l" : "xl"}
              />
            }
            level={["xs", "s"].includes(screenSize) ? 5 : 4}
          />
          {headerButtonVisible && (
            <ActionGroup
              itemList={[
                {
                  children: <Lsi lsi={{ en: "Create new activity", cs: "Vytvořit novou aktivitu" }} />,
                  colorScheme: "primary",
                  significance: "common",
                  onClick: () => setOpenModal(true),
                  order: -1,
                  icon: "mdi-plus",
                  collapsed: false,
                  size: ["xl", "l"].includes(screenSize) ? "m" : screenSize === "m" ? "s" : "xs",
                },
              ]}
              collapsedMenuProps={{
                colorScheme: "primary",
                significance: "common",
              }}
            />
          )}
        </div>
        <ActivityListProvider>
          {({ state, data, errorData, pendingData, handlerMap }) => {
            loadRef.current = handlerMap.load;
            loadNextRef.current = handlerMap.loadNext;
            createActivityRef.current = handlerMap.create;

            switch (state) {
              case "pending":
              case "pendingNoData":
                return renderLoading();
              case "error":
                renderReady(data, handlerMap);
              case "errorNoData":
                return renderError(errorData);
              case "ready":
              case "readyNoData":
                return renderReady(data, handlerMap);
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
    );
    //@@viewOff:render
  },
});

MyActivities = withRoute(MyActivities, { authenticated: true });

//@@viewOn:exports
export { MyActivities };
export default MyActivities;
//@@viewOff:exports
