//@@viewOn:imports
import { createVisualComponent, useState, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5 from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";
import { AuthorizationContextProvider } from "../contexts/authorization-context.js";
import SideMenuDrawer from "./side-menu-drawer.js";

import Config from "./config/config.js";
import Home from "../routes/home.js";
import AppBar from "./app-bar.js";

const ActivityPage = Utils.Component.lazy(() => import("../routes/activity-page.js"));
const ActivityManagement = Utils.Component.lazy(() => import("../routes/activity-management.js"));
const MyActivities = Utils.Component.lazy(() => import("../routes/my-activities.js"));
const Invitations = Utils.Component.lazy(() => import("../routes/invitations.js"));
const About = Utils.Component.lazy(() => import("../routes/about.js"));
const InitAppWorkspace = Utils.Component.lazy(() => import("../routes/init-app-workspace.js"));
const ControlPanel = Utils.Component.lazy(() => import("../routes/control-panel.js"));
//@@viewOff:imports

//@@viewOn:constants
const ROUTE_MAP = {
  "": { rewrite: "home" },
  home: (props) => <Home {...props} />,
  "my-activities": (props) => <MyActivities {...props} />,
  "management/activities": (props) => <ActivityManagement {...props} />,
  invitations: (props) => <Invitations {...props} />,
  activity: ({ params }) => <ActivityPage id={params.id} />,
  about: (props) => <About {...props} />,
  "sys/uuAppWorkspace/initUve": (props) => <InitAppWorkspace {...props} />,
  controlPanel: (props) => <ControlPanel {...props} />,
  "*": () => (
    <Uu5Elements.Text category="story" segment="heading" type="h1">
      Not Found
    </Uu5Elements.Text>
  ),
};
//@@viewOff:constants

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const Spa = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Spa",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    const [menuOpen, setMenuOpen] = useState(false);
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Plus4U5.SpaProvider initialLanguageList={["en", "cs"]}>
        <Uu5Elements.ModalBus>
          <Plus4U5App.Top.View
            topBgColor="rgb(33, 150, 243)"
            textBackground="full"
            unitName={
              <AppBar
                handleCloseSideMenu={() => setMenuOpen(false)}
                handleOpenSideMenu={() => setMenuOpen(true)}
                sideMenuOpen={menuOpen}
              />
            }
          />
          <SideMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)}>
            <AuthorizationContextProvider>
              <Plus4U5App.Spa routeMap={ROUTE_MAP} displayTop={false} />
            </AuthorizationContextProvider>
          </SideMenuDrawer>
        </Uu5Elements.ModalBus>
      </Plus4U5.SpaProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Spa };
export default Spa;
//@@viewOff:exports
