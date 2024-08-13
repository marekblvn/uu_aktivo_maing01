//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import Config from "./config/config.js";
import Container from "./container.js";
import { Grid } from "uu5g05-elements";
import MemberList from "./member-list.js";
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

const ActivityMembersView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityMembersView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ members, owner, administrators }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Container>
        <Grid>
          <MemberList />
          <MemberList />
          <MemberList />
        </Grid>
      </Container>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityMembersView };
export default ActivityMembersView;
//@@viewOff:exports
