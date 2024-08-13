//@@viewOn:imports
import { createVisualComponent, useScreenSize, useEffect, useSession, useRoute, Lsi } from "uu5g05";
import Config from "./config/config.js";
import Logo from "./logo.js";
import { ActionGroup, RichIcon } from "uu5g05-elements";
import importLsi from "../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: () => Config.Css.css({}),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const AppBar = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AppBar",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ handleCloseSideMenu, handleOpenSideMenu, sideMenuOpen }) {
    //@@viewOn:private
    const { state } = useSession();
    const [, setRoute] = useRoute();
    const [screenSize] = useScreenSize();

    useEffect(() => {
      if (["xs", "s"].includes(screenSize)) {
        handleCloseSideMenu();
      }
    }, [screenSize]);
    //@@viewOff:private

    const itemList = [
      {
        children: <Lsi import={importLsi} path={["Menu", "my-activities"]} />,
        onClick: () => {
          handleCloseSideMenu();
          setRoute("my-activities");
        },
        icon: "uugdsstencil-weather-bolt",
        colorScheme: "building",
      },
      {
        children: <Lsi import={importLsi} path={["Menu", "invitations"]} />,
        onClick: () => {
          handleCloseSideMenu();
          setRoute("invitations");
        },
        icon: "uugds-email",
        colorScheme: "building",
      },
      {
        children: <Lsi import={importLsi} path={["Menu", "about"]} />,
        onClick: () => {
          handleCloseSideMenu();
          setRoute("about");
        },
        icon: "uugds-info",
        colorScheme: "building",
        collapsed: true,
      },
    ];

    //@@viewOn:render
    if (state !== "authenticated") {
      return <Logo />;
    }

    function renderContent() {
      if (["xs", "s"].includes(screenSize)) {
        return (
          <>
            <RichIcon
              onClick={sideMenuOpen ? handleCloseSideMenu : handleOpenSideMenu}
              icon={sideMenuOpen ? "mdi-close" : "mdi-menu"}
              colorScheme="building"
              style={{
                backgroundColor: "transparent",
              }}
            />
            <div style={{ height: "36px", width: "1px", backgroundColor: "#f9f9f9", margin: "0 8px 0 8px" }} />
            <Logo />
          </>
        );
      } else {
        return (
          <>
            <Logo />
            <ActionGroup
              itemList={itemList}
              collapsedMenuProps={{
                colorScheme: "building",
              }}
            />
          </>
        );
      }
    }

    return <div style={{ display: "flex", alignItems: "center", paddingTop: "2px" }}>{renderContent()}</div>;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AppBar };
export default AppBar;
//@@viewOff:exports
