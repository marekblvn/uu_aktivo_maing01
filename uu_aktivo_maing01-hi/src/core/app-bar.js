//@@viewOn:imports
import { createVisualComponent, useScreenSize, useEffect, useSession, useRoute, Lsi } from "uu5g05";
import Config from "./config/config.js";
import Logo from "./logo.js";
import { ActionGroup, RichIcon } from "uu5g05-elements";
import importLsi from "../lsi/import-lsi.js";
import { useAuthorization } from "../contexts/authorization-context.js";
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
    const { isAuthority, isExecutive } = useAuthorization();
    const { state } = useSession();
    const [, setRoute] = useRoute();
    const [screenSize] = useScreenSize();

    useEffect(() => {
      handleCloseSideMenu();
    }, [screenSize]);
    //@@viewOff:private

    const itemList = [
      {
        children: <Lsi import={importLsi} path={["Menu", "my-activities"]} />,
        onClick: () => {
          handleCloseSideMenu();
          setRoute("my-activities");
        },
        icon: "uugdsstencil-chart-pulse",
        colorScheme: "building",
        order: -1,
      },
      {
        children: <Lsi import={importLsi} path={["Menu", "invitations"]} />,
        onClick: () => {
          handleCloseSideMenu();
          setRoute("invitations");
        },
        icon: "uugds-email",
        colorScheme: "building",
        order: -1,
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

    if (isAuthority || isExecutive) {
      itemList.push({
        children: <Lsi import={importLsi} path={["Menu", "management"]} />,
        itemList: [
          {
            children: <Lsi import={importLsi} path={["Menu", "management/activities"]} />,
            icon: "uugdsstencil-chart-pulse",
            onClick: () => {
              handleCloseSideMenu();
              setRoute("management/activities");
            },
          },
        ],
        icon: "mdi-wrench-outline",
        colorScheme: "building",
        order: -1,
      });
    }

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
