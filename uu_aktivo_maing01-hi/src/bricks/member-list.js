//@@viewOn:imports
import { createVisualComponent, Fragment, Lsi } from "uu5g05";
import Config from "./config/config.js";
import { Grid, Icon, Line, LinkPanel, Text } from "uu5g05-elements";
import MemberTile from "./member-tile.js";
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

const MemberList = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "MemberList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    collapsible: false,
  },
  //@@viewOff:defaultProps

  render({ owner, administrators, members, onRemoveMember, onPromoteAdmin, onDemoteAdmin, onLeaveActivity }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Grid>
        <Fragment>
          <Text category="interface" segment="highlight" type="common" autoFit>
            <Icon icon={"mdi-crown"} margin={{ right: "4px" }} style={{ color: "rgb(218,165,32)" }} />
            <Lsi lsi={{ en: "Activity owner", cs: "Vlastník aktivity" }} />
          </Text>
          <MemberTile uuIdentity={owner} colorScheme="primary" />
        </Fragment>
        <Line colorScheme="neutral" significance="subdued" />
        <LinkPanel
          header={
            <Text category="interface" segment="highlight" type="common" autoFit>
              <Icon icon={"mdi-star"} colorScheme={"steel"} margin={{ right: "4px" }} />
              <Lsi
                lsi={{
                  en: `Administrators ${administrators.length > 0 ? "(" + administrators.length + ")" : ""}`,
                  cs: `Správci ${administrators.length > 0 ? "(" + administrators.length + ")" : ""}`,
                }}
              />
            </Text>
          }
        >
          {administrators.map((item, idx) => (
            <MemberTile
              key={idx}
              uuIdentity={item}
              onLeaveActivity={onLeaveActivity}
              onRemoveMember={onRemoveMember}
              onPromoteAdmin={onPromoteAdmin}
              onDemoteAdmin={onDemoteAdmin}
            />
          ))}
        </LinkPanel>
        <Line colorScheme="neutral" significance="subdued" />
        <LinkPanel
          header={
            <Text category="interface" segment="highlight" type="common" autoFit>
              <Icon icon={"mdi-account-multiple"} colorScheme={"building"} margin={{ right: "4px" }} />
              <Lsi
                lsi={{
                  en: `Members ${members.length > 0 ? "(" + members.length + ")" : ""}`,
                  cs: `Členové ${members.length > 0 ? "(" + members.length + ")" : ""}`,
                }}
              />
            </Text>
          }
        >
          {members.map((item, idx) => (
            <MemberTile
              key={idx}
              uuIdentity={item.uuIdentity}
              onLeaveActivity={onLeaveActivity}
              onRemoveMember={onRemoveMember}
              onPromoteAdmin={onPromoteAdmin}
              onDemoteAdmin={onDemoteAdmin}
            />
          ))}
        </LinkPanel>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { MemberList };
export default MemberList;
//@@viewOff:exports
