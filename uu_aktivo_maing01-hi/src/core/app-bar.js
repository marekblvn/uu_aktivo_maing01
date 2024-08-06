//@@viewOn:imports
import { createVisualComponent, Lsi, useRoute, useScreenSize, useState, useEffect, useSession } from "uu5g05";
import Config from "./config/config.js";
import Logo from "./logo.js";
import { ActionGroup, Button, Drawer, MenuList } from "uu5g05-elements";
import importLsi from "../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  bar: (screenSize) =>
    Config.Css.css({
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 905,
      display: "flex",
      alignItems: "center",
      justifyContent: ["xs", "s"].includes(screenSize) ? "start" : "space-between",
      marginTop: "2px",
      marginLeft: "10px",
      width: "calc(100% - 164px)",
    }),
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

  render() {
    //@@viewOn:private
    const [, setRoute] = useRoute();
    const [screenSize] = useScreenSize();
    const { state } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
      setMenuOpen(false);
    }, [screenSize]);

    const itemList = [
      {
        children: <Lsi import={importLsi} path={["Menu", "my-activities"]} />,
        onClick: () => {
          setMenuOpen(false);
          setRoute("my-activities");
        },
        icon: "uugdsstencil-weather-bolt",
        primary: true,
      },
      {
        children: <Lsi import={importLsi} path={["Menu", "invitations"]} />,
        onClick: () => {
          setMenuOpen(false);
          setRoute("invitations");
        },
        icon: "uugds-email",
        primary: true,
      },
      { divider: true },
      {
        children: <Lsi import={importLsi} path={["Menu", "about"]} />,
        onClick: () => {
          setMenuOpen(false);
          setRoute("about");
        },
        icon: "uugds-info",
        collapsed: true,
      },
    ];

    const renderMenu = (screenSize) => {
      if (["xs", "s"].includes(screenSize)) {
        return (
          <div className={Css.bar(screenSize)}>
            <Button
              icon={menuOpen ? "uugds-close" : "uugds-menu"}
              onClick={() => setMenuOpen((prev) => !prev)}
              colorScheme="primary"
              significance="highlighted"
            />
            <Logo />
          </div>
        );
      } else {
        return (
          <div className={Css.bar(screenSize)}>
            <Logo />
            <ActionGroup
              itemList={itemList.filter((item) => item.divider !== true)}
              alignment="right"
              collapsedMenuProps={{ colorScheme: "primary", significance: "highlighted" }}
            />
          </div>
        );
      }
    };
    //@@viewOff:private

    //@@viewOn:render
    if (state !== "authenticated") {
      return (
        <div className={Css.bar(screenSize)}>
          <Logo />
        </div>
      );
    }

    return (
      <>
        {renderMenu(screenSize)}
        <Drawer
          className={Config.Css.css({ position: "absolute", top: 58, left: 0 })}
          open={menuOpen}
          type="elevated"
          content={
            <div>
              <MenuList itemBorderRadius="moderate" itemList={itemList} />
            </div>
          }
          onClose={() => setMenuOpen(false)}
          spacing="loose"
        />
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AppBar };
export default AppBar;
//@@viewOff:exports
