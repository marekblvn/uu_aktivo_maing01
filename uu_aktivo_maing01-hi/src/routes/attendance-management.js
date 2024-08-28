//@@viewOn:imports
import { createVisualComponent, useLsi } from "uu5g05";
import { Dialog, Pending } from "uu5g05-elements";
import { useAlertBus, Error } from "uu_plus4u5g02-elements";
import { withRoute } from "uu_plus4u5g02-app";
import Config from "./config/config.js";
import { useAuthorization } from "../contexts/authorization-context.js";
import Container from "../bricks/container.js";
import AttendanceListProvider from "../providers/attendance-list-provider.js";
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

const _AttendanceManagement = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AttendanceManagement",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { isAuthority, isExecutive } = useAuthorization();
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const { showError, addAlert } = useAlertBus();

    //@@viewOff:private

    //@@viewOn:render
    if (!isAuthority && !isExecutive) {
      return (
        <Unauthorized
          title={{
            en: "You don't have the necessary permissions to see this page",
            cs: "Nemáte dostatečná oprávnění pro zobrazení této stránky",
          }}
          subtitle={{ en: "Super secret stuff is going on here...", cs: "Dějí se zde super tajné věci..." }}
        />
      );
    }

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

    function renderReady(data, state, handlerMap) {
      return <div>ready</div>;
    }

    return (
      <Container
        style={{
          height: "calc(100vh - 88px)",
          marginTop: "12px",
        }}
      >
        <AttendanceListProvider pageSize={100}>
          {({ state, data, errorData, handlerMap }) => {
            switch (state) {
              case "pendingNoData":
                return renderLoading();
              case "errorNoData":
                return renderError(errorData);
              case "error":
                showError(errorData);
              case "pending":
              case "itemPending":
              case "ready":
              case "readyNoData":
                return renderReady(data, state, handlerMap);
            }
          }}
        </AttendanceListProvider>
        <Dialog />
      </Container>
    );
    //@@viewOff:render
  },
});

const AttendanceManagement = withRoute(_AttendanceManagement, { authenticated: true });

//@@viewOn:exports
export { AttendanceManagement };
export default AttendanceManagement;
//@@viewOff:exports
