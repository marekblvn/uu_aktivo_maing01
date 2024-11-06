//@@viewOn:imports
import { createVisualComponent, Lsi, PropTypes, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Block, DateTime, Grid, Icon, Number, Text } from "uu5g05-elements";
import { useAuthorization } from "../contexts/authorization-context.js";
import { useActivityAuthorization } from "../contexts/activity-authorization-context.js";
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

const AttendanceTile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AttendanceTile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.object,
    onDelete: PropTypes.func,
    onOpenDetail: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    data: {},
    onDelete: () => {},
    onOpenDetail: () => {},
  },
  //@@viewOff:defaultProps

  render({ data, onDelete, onOpenDetail }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { isAuthority, isExecutive } = useAuthorization();
    const { isAdministrator, isOwner } = useActivityAuthorization();
    const canDeleteAttendance = isAuthority || isExecutive || isAdministrator || isOwner;
    //@@viewOff:private

    const actionList = canDeleteAttendance
      ? [
          {
            icon: "uugds-delete",
            colorScheme: "negative",
            onClick: () => onDelete(data),
            collapsed: "always",
            children: <Lsi lsi={{ en: "Delete attendance", cs: "Smazat docházku" }} />,
          },
          { icon: "uugds-open-in-modal", onClick: () => onOpenDetail(data) },
        ]
      : [{ icon: "uugds-open-in-modal", onClick: () => onOpenDetail(data) }];

    //@@viewOn:render

    return (
      <Block
        card="full"
        headerSeparator={true}
        header={
          <Text category="interface" segment="content" type="medium">
            <DateTime value={data.datetime} timeFormat="short" dateFormat="short" />
          </Text>
        }
        actionList={actionList}
      >
        <Grid
          rowGap={{ xs: "8px", s: "16px" }}
          style={{
            padding: screenSize === "xs" ? "8px" : "16px",
            marginTop: "4px",
            fontSize: screenSize === "xs" ? "13px" : "16px",
          }}
        >
          <Grid templateColumns={{ xs: "auto 48px" }}>
            <Text category="interface" segment="content" type="medium">
              <Icon icon="uugdsstencil-communication-thumb-up" colorScheme="positive" margin="0 4px" />
              <Lsi lsi={{ en: "Confirmed", cs: "Potvrdilo" }} />
            </Text>
            <div style={{ textAlign: "right" }}>
              <Text category="interface" segment="content" type="medium">
                <Number value={data.confirmed.length} />
              </Text>
            </div>
          </Grid>
          <Grid templateColumns={{ xs: "auto 48px" }}>
            <Text category="interface" segment="content" type="medium">
              <Icon icon="uugds-help" colorScheme="neutral" margin="0 4px" />
              <Lsi lsi={{ en: "Undecided", cs: "Nerozhodlo se" }} />
            </Text>
            <div style={{ textAlign: "right" }}>
              <Text category="interface" segment="content" type="medium">
                <Number value={data.undecided.length} />
              </Text>
            </div>
          </Grid>
          <Grid templateColumns={{ xs: "auto 48px" }}>
            <Text category="interface" segment="content" type="medium">
              <Icon icon="uugdsstencil-communication-thumb-down" colorScheme="negative" margin="0 4px" />
              <Lsi lsi={{ en: "Denied", cs: "Odmítlo" }} />
            </Text>
            <div style={{ textAlign: "right" }}>
              <Text category="interface" segment="content" type="medium">
                <Number value={data.denied.length} />
              </Text>
            </div>
          </Grid>
        </Grid>
      </Block>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AttendanceTile };
export default AttendanceTile;
//@@viewOff:exports
