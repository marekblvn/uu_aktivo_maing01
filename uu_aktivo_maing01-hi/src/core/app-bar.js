//@@viewOn:imports
import { createVisualComponent, useScreenSize, useEffect, useSession } from "uu5g05";
import Config from "./config/config.js";
import Logo from "./logo.js";
import { ActionGroup, RichIcon } from "uu5g05-elements";
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

  render({ handleCloseSideMenu, handleOpenSideMenu, sideMenuOpen, menuItems }) {
    //@@viewOn:private
    const { state } = useSession();
    const [screenSize] = useScreenSize();

    useEffect(() => {
      if (["xs", "s"].includes(screenSize)) {
        handleCloseSideMenu();
      }
    }, [screenSize]);
    //@@viewOff:private

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
              itemList={menuItems}
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
