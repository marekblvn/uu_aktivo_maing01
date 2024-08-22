//@@viewOn:imports
import { createVisualComponent, Lsi, useSession } from "uu5g05";
import Config from "./config/config.js";
import { Panel, ScrollableBox } from "uu5g05-elements";
import ParticipationItem from "./participation-item.js";
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

const ParticipationList = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ParticipationList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    items: { confirmed: [], undecided: [], denied: [] },
    maxHeight: 300,
    minHeight: 300,
    width: "100%",
  },
  //@@viewOff:defaultProps

  render({ items, maxHeight, minHeight, width }) {
    //@@viewOn:private
    const { confirmed, undecided, denied } = items;
    //@@viewOff:private

    //@@viewOn:render
    return (
      <ScrollableBox
        maxHeight={maxHeight}
        minHeight={minHeight}
        scrollbarWidth={10}
        style={{ padding: "0px 8px 0px 0px", width: width }}
      >
        <div style={{ marginTop: "8px" }}>
          {confirmed.map((item, idx) => {
            return (
              <ParticipationItem
                key={idx}
                uuIdentity={item}
                colorScheme="positive"
                icon="uugdsstencil-communication-thumb-up"
              />
            );
          })}
        </div>
        <div style={{ margin: "8px 0 8px" }}>
          {undecided.map((item, idx) => {
            return <ParticipationItem key={idx} uuIdentity={item} colorScheme="neutral" icon="uugds-help" />;
          })}
        </div>
        <div style={{ marginBottom: "8px" }}>
          {denied.map((item, idx) => {
            return (
              <ParticipationItem
                key={idx}
                uuIdentity={item}
                colorScheme="negative"
                icon="uugdsstencil-communication-thumb-down"
              />
            );
          })}
        </div>
      </ScrollableBox>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ParticipationList };
export default ParticipationList;
//@@viewOff:exports
