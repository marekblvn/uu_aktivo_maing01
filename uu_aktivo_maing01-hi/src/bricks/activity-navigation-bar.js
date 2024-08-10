//@@viewOn:imports
import { createVisualComponent, Utils, useId, Lsi, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Button, Icon, RichIcon, Text } from "uu5g05-elements";
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

const ActivityNavigationBar = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityNavigationBar",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    itemList: [],
  },
  //@@viewOff:defaultProps

  render({ itemList, activeCode, onChange, ...props }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props, Css.main(props));

    function renderItems(itemList) {
      if (!itemList) return null;
      return itemList.map((item) => {
        const isActive = activeCode === item.code;
        const id = useId();
        return (
          <Button
            key={id}
            onClick={() => onChange({ activeCode: item.code })}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: "8px",
              borderRadius: 0,
            }}
            colorScheme={isActive ? "primary" : "neutral"}
            significance={isActive ? "common" : "subdued"}
          >
            <RichIcon icon={item.icon} size="m" colorScheme={isActive ? "primary" : "neutral"} significance="subdued" />
            <Text category="interface" segment="content" type="small">
              {item.label}
            </Text>
          </Button>
        );
      });
    }

    return (
      <div
        {...attrs}
        style={{
          height: "56px",
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "rgb(256, 256, 256)", // hover rgb(25, 118, 210)
          boxShadow: "rgba(33, 33, 33, 0.32) 0px -2px 10px 0px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        {renderItems(itemList)}
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityNavigationBar };
export default ActivityNavigationBar;
//@@viewOff:exports
