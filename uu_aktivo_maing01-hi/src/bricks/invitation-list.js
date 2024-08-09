//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import Config from "./config/config.js";
import InvitationCard from "../bricks/invitation-card.js";
import { Grid, Skeleton } from "uu5g05-elements";
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

const InvitationList = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "InvitationList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    itemList: [],
    onInvitationDelete: () => {},
    onInvitationAccept: () => {},
  },
  //@@viewOff:defaultProps

  render({ itemList, onInvitationDelete, onInvitationAccept }) {
    //@@viewOn:private
    //@@viewOff:private

    function renderInvitations(itemList) {
      return itemList.map((item) => {
        if (item.state === "ready") {
          return (
            <InvitationCard
              key={item.data.id}
              data={item.data}
              onInvitationDelete={() => onInvitationDelete(item)}
              onInvitationAccept={() => onInvitationAccept(item)}
            />
          );
        } else {
          return <Skeleton />;
        }
      });
    }

    //@@viewOn:render
    return (
      <Grid templateColumns="100%" rowGap={{ s: "12px", l: "18px" }}>
        {renderInvitations(itemList)}
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { InvitationList };
export default InvitationList;
//@@viewOff:exports
