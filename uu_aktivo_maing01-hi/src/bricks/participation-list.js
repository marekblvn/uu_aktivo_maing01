//@@viewOn:imports
import { createVisualComponent, PropTypes } from "uu5g05";
import Config from "./config/config.js";
import { Grid, PlaceholderBox } from "uu5g05-elements";
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
  propTypes: {
    confirmed: PropTypes.array,
    undecided: PropTypes.array,
    denied: PropTypes.array,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    confirmed: [],
    undecided: [],
    denied: [],
  },
  //@@viewOff:defaultProps

  render({ confirmed, denied, undecided }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    if ([...confirmed, ...denied, ...undecided].length === 0) {
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PlaceholderBox
            code="users"
            header={{ en: "There are no other members", cs: "Nejsou žádní další členové" }}
            info={{ en: "You are the sole member of the activity.", cs: "Jste jediným členem aktivity." }}
          />
        </div>
      );
    }

    return (
      <Grid templateRows={{ xs: "repeat(3,auto)" }} rowGap="8px">
        <Grid templateRows={{ xs: `repeat(${4}, auto)` }} alignItems="start" rowGap="2px">
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
        </Grid>
        <Grid templateRows={{ xs: `repeat(${3}, auto)` }} alignItems="start" rowGap="2px">
          {undecided.map((item, idx) => {
            return <ParticipationItem key={idx} uuIdentity={item} colorScheme="neutral" icon="uugds-help" />;
          })}
        </Grid>
        <Grid templateRows={{ xs: `repeat(${5}, auto)` }} alignItems="start" rowGap="2px">
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
        </Grid>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ParticipationList };
export default ParticipationList;
//@@viewOff:exports
