//@@viewOn:imports
import { createVisualComponent, Lsi, useRoute, useState, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Plus4U5 from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import Home from "../routes/home.js";
import ActivityPage from "../routes/activity-page.js";
import AppBar from "./app-bar.js";
import { AuthorizationContextProvider } from "../contexts/authorization-context.js";
import importLsi from "../lsi/import-lsi.js";
import SideMenuDrawer from "./side-menu-drawer.js";

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
    const [, setRoute] = useRoute();
    const [menuOpen, setMenuOpen] = useState(false);
    //@@viewOff:private

    const itemList = [
      {
        children: <Lsi import={importLsi} path={["Menu", "my-activities"]} />,
        onClick: () => {
          setMenuOpen(false);
          setRoute("my-activities");
        },
        icon: "uugdsstencil-weather-bolt",
        colorScheme: "building",
      },
      {
        children: <Lsi import={importLsi} path={["Menu", "invitations"]} />,
        onClick: () => {
          setMenuOpen(false);
          setRoute("invitations");
        },
        icon: "uugds-email",
        colorScheme: "building",
      },
      { divider: true },
      {
        children: <Lsi import={importLsi} path={["Menu", "about"]} />,
        onClick: () => {
          setMenuOpen(false);
          setRoute("about");
        },
        icon: "uugds-info",
        colorScheme: "building",
        collapsed: true,
      },
    ];

    //@@viewOn:render
    return (
      <Plus4U5.SpaProvider initialLanguageList={["en", "cs"]}>
        <Uu5Elements.ModalBus>
          <AuthorizationContextProvider>
            <Plus4U5App.Top.View
              topBgColor="rgb(33, 150, 243)"
              textBackground="full"
              unitName={
                <AppBar
                  handleCloseSideMenu={() => setMenuOpen(false)}
                  handleOpenSideMenu={() => setMenuOpen(true)}
                  sideMenuOpen={menuOpen}
                  menuItems={itemList.filter((item) => !item.divider)}
                />
              }
            />
            <SideMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} itemList={itemList}>
              <Plus4U5App.Spa routeMap={ROUTE_MAP} displayTop={false} />
            </SideMenuDrawer>
          </AuthorizationContextProvider>
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
