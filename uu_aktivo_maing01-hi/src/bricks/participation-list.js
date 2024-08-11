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
    confirmed: [],
    undecided: [],
    denied: [],
  },
  //@@viewOff:defaultProps

  render({ confirmed, undecided, denied }) {
    //@@viewOn:private
    const { identity } = useSession();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <ScrollableBox
        maxHeight={400}
        minHeight={400}
        scrollbarWidth={10}
        style={{ padding: "0px 8px 0px 0px", width: "100%" }}
      >
        <div style={{ marginTop: "8px" }}>
          {confirmed
            .filter((item) => item !== identity.uuIdentity)
            .map((item, idx) => {
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
          {undecided
            .filter((item) => item !== identity.uuIdentity)
            .map((item, idx) => {
              return <ParticipationItem key={idx} uuIdentity={item} colorScheme="neutral" icon="uugds-help" />;
            })}
        </div>
        <div style={{ marginBottom: "8px" }}>
          {denied
            .filter((item) => item !== identity.uuIdentity)
            .map((item, idx) => {
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
