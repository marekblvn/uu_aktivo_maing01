//@@viewOn:imports
import { createVisualComponent, Lsi, useEffect, useRoute, useScrollDirection, Utils } from "uu5g05";
import Config from "./config/config.js";
import { Drawer, MenuList } from "uu5g05-elements";
import importLsi from "../lsi/import-lsi.js";
import { useAuthorization } from "../contexts/authorization-context.js";
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

const SideMenuDrawer = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "SideMenuDrawer",
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
    const { children, open, onClose } = props;
    const scrollDirection = useScrollDirection(window);
    const [route, setRoute] = useRoute();
    //@@viewOff:private

    useEffect(() => {
      if (scrollDirection !== undefined) {
        onClose();
      }
    }, [scrollDirection]);

    useEffect(() => {
      onClose();
    }, [route]);

    const itemList = [
      {
        children: <Lsi import={importLsi} path={["Menu", "my-activities"]} />,
        onClick: () => {
          setRoute("my-activities");
        },
        icon: "uugdsstencil-chart-pulse",
        colorScheme: "building",
        order: -1,
      },
      {
        children: <Lsi import={importLsi} path={["Menu", "invitations"]} />,
        onClick: () => {
          setRoute("invitations");
        },
        icon: "uugds-email",
        colorScheme: "building",
        order: -1,
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
              setRoute("management/activities");
            },
          },
          {
            children: <Lsi import={importLsi} path={["Menu", "management/invitations"]} />,
            icon: "uugds-email",
            colorScheme: "building",
            onClick: () => {
              setRoute("management/invitations");
            },
          },
        ],
        icon: "mdi-wrench-outline",
        colorScheme: "building",
        order: -1,
      });
    }

    itemList.push({
      children: <Lsi import={importLsi} path={["Menu", "about"]} />,
      onClick: () => {
        setRoute("about");
      },
      icon: "uugds-info",
      colorScheme: "building",
      order: 1,
    });

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props, Css.main(props));

    return (
      <Drawer
        {...attrs}
        open={open}
        onClose={onClose}
        content={<MenuList itemList={itemList} />}
        type="elevated"
        spacing="loose"
        width={window.innerWidth}
      >
        {children}
      </Drawer>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { SideMenuDrawer };
export default SideMenuDrawer;
//@@viewOff:exports
