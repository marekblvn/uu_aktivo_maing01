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
import { ActionGroup, Dialog, Grid, Header, Pending, PlaceholderBox, RichIcon } from "uu5g05-elements";
import ActivityAlbum from "../bricks/activity-album.js";
import CreateActivityForm from "../bricks/create-activity-form.js";
import importLsi from "../lsi/import-lsi.js";
import { useAlertBus } from "uu_plus4u5g02-elements";
import { CancelButton, SubmitButton } from "uu5g05-forms";
import FormModal from "../bricks/form-modal.js";
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

const _MyActivities = createVisualComponent({
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
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const loadRef = useRef();
    const createActivityRef = useRef();
    const loadNextRef = useRef();
    const [dialogProps, setDialogProps] = useState(null);
    const [modalProps, setModalProps] = useState(null);
    const placeholderLsi = useLsi({ import: importLsi, path: ["Placeholder", "noActivityList"] });
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    //@@viewOff:private

    //@@viewOn:methods
    const showDialog = useCallback(
      (onConfirm) => {
        setDialogProps({
          header: <Lsi import={importLsi} path={["Dialog", "leaveActivity", "header"]} />,
          icon: "mdi-exit-run",
          info: <Lsi import={importLsi} path={["Dialog", "leaveActivity", "info"]} />,
          actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
          actionList: [
            {
              children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
              onClick: (e) => {
                setDialogProps(null);
              },
            },
            {
              children: <Lsi import={importLsi} path={["Dialog", "leaveActivity", "confirm"]} />,
              onClick: onConfirm,
              colorScheme: "negative",
            },
          ],
        });
      },
      [setDialogProps],
    );

    const showModal = useCallback(
      (onSubmit) => {
        setModalProps({
          open: true,
          onClose: () => setModalProps(null),
          onSubmit: onSubmit,
          header: <Lsi lsi={{ en: "Create new activity", cs: "Vytvořit novou aktivitu" }} />,
          footer: (
            <Grid templateColumns={{ xs: "repeat(2,1fr)", s: "repeat(2,auto)" }} justifyContent={{ s: "end" }}>
              <CancelButton onClick={() => setModalProps(null)} />
              <SubmitButton>
                <Lsi lsi={{ en: "Create", cs: "Vytvořit" }} />
              </SubmitButton>
            </Grid>
          ),
          children: <CreateActivityForm />,
        });
      },
      [setModalProps],
    );
    //@@viewOff:methods

    //@@viewOn:render
    function renderLoading() {
      return <Pending size="max" colorScheme="primary" />;
    }

    function renderError(errorData) {
      const errorCode = errorData.error?.code;
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
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
      const handleCreateActivity = () => {
        showModal(async (e) => {
          e.preventDefault();
          try {
            const activity = await handlerMap.create(e.data.value);
            setModalProps(null);
            addAlert({
              priority: "success",
              header: { en: "New activity created!", cs: "Nová aktivita byla vytvořena!" },
              message: {
                en: `Activity '${activity.name}' was successfully created.`,
                cs: `Aktivita '${activity.name}' byla úspěšně vytvořena.`,
              },
              durationMs: 2000,
            });
          } catch (error) {
            showError(error);
          }
        });
      };
      if (!data.length) {
        return (
          <Grid
            style={{ marginBottom: "24px", padding: "0 8px" }}
            templateRows={{ xs: "auto 1fr" }}
            templateColumns={{ xs: "100%" }}
          >
            <div style={{ display: "flex", justifyContent: "start" }}>
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
            </div>
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
                  onClick: handleCreateActivity,
                },
              ]}
              style={{ marginTop: "10%", padding: "0 16px" }}
            />
          </Grid>
        );
      }

      const handleLeaveActivity = (item) => {
        showDialog(async (e) => {
          e.preventDefault();
          try {
            await item.handlerMap.leave({ id: item.data.id });
            setDialogProps(null);
            addAlert({
              priority: "info",
              header: {
                en: `You have left the activity '${item.data.name}'`,
                cs: `Opustil(a) jste aktivitu '${item.data.name}'`,
              },
              message: {
                en: "The activity will no longer be visible for you.",
                cs: "Aktivita pro vás již nebude přístupná.",
              },
              durationMs: 2000,
            });
          } catch (error) {
            showError(error);
            return;
          }
        });
      };

      const dataToRender = data.filter((item) => item != null);

      return (
        <>
          <div style={{ display: "flex", marginBottom: "24px", padding: "0 8px" }}>
            <Header
              title={<Lsi lsi={{ en: "My Activities", cs: "Moje aktivity" }} />}
              icon={
                <RichIcon
                  icon="uugdsstencil-chart-pulse"
                  colorScheme="primary"
                  significance="subdued"
                  borderRadius="moderate"
                  cssBackground="#ffffff"
                  size={screenSize === "xs" ? "l" : "xl"}
                />
              }
              level={["xs", "s"].includes(screenSize) ? 5 : 4}
            />
            <ActionGroup
              itemList={[
                {
                  children: <Lsi lsi={{ en: "Create new activity", cs: "Vytvořit novou aktivitu" }} />,
                  colorScheme: "primary",
                  significance: "common",
                  onClick: handleCreateActivity,
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
          </div>
          <ActivityAlbum itemList={dataToRender} onActivityLeave={handleLeaveActivity} />
          <AutoLoad
            data={data}
            handleLoadNext={() => handlerMap.loadNext({ filters: { members: [identity.uuIdentity] } })}
            distance={window.innerHeight}
          />
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
        <ActivityListProvider filters={{ members: [identity.uuIdentity] }} pageSize={10}>
          {({ state, data, errorData, pendingData, handlerMap }) => {
            loadRef.current = handlerMap.load;
            loadNextRef.current = handlerMap.loadNext;
            createActivityRef.current = handlerMap.create;

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
        </ActivityListProvider>
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
        <FormModal {...modalProps} />
      </Container>
    );
    //@@viewOff:render
  },
});

const MyActivities = withRoute(_MyActivities, { authenticated: true });

//@@viewOn:exports
export { MyActivities };
export default MyActivities;
//@@viewOff:exports
