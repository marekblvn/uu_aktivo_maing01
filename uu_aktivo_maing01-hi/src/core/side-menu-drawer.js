//@@viewOn:imports
import { createVisualComponent, useEffect, useScrollDirection, Utils } from "uu5g05";
import Config from "./config/config.js";
import { Drawer, MenuList } from "uu5g05-elements";
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
    const { children, open, onClose, itemList } = props;
    const scrollDirection = useScrollDirection(window);
    //@@viewOff:private

    useEffect(() => {
      if (scrollDirection !== undefined) {
        onClose();
      }
    }, [scrollDirection]);

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
