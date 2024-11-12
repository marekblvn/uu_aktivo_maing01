//@@viewOn:imports
import { createVisualComponent, Lsi, PropTypes } from "uu5g05";
import Config from "./config/config.js";
import { Block, DateTime, Grid, Icon, Line, LinkPanel, Modal } from "uu5g05-elements";
import { PersonItem } from "uu_plus4u5g02-elements";
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

const AttendanceDetailModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AttendanceDetailModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    data: PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    open: false,
    onClose: () => {},
    data: {
      datetime: "",
      confirmed: [],
      undecided: [],
      denied: [],
    },
  },
  //@@viewOff:defaultProps

  render({ open, onClose, data }) {
    //@@viewOn:private
    const { datetime, confirmed, denied, undecided } = data;
    const { isAuthority, isExecutive } = useAuthorization();
    const shouldShowUuIdentity = isAuthority || isExecutive;
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Modal header={<DateTime value={datetime} timeFormat="medium" dateFormat="long" />} open={open} onClose={onClose}>
        <Block style={{ padding: "0 14px 8px" }}>
          <Grid templateColumns={{ xs: "100%" }} templateRows={{ xs: "repeat(3,auto)" }} style={{ marginTop: "8px" }}>
            <LinkPanel
              header={
                <>
                  <Icon icon="uugdsstencil-communication-thumb-up" colorScheme="positive" margin="0 8px 0 0" />
                  <Lsi lsi={{ en: `Confirmed (${confirmed.length})`, cs: `Potvrdili (${confirmed.length})` }} />
                </>
              }
            >
              <Grid templateColumns={{ xs: "1fr", s: "repeat(2, 1fr)" }} style={{ marginTop: "8px" }}>
                {confirmed.map((item) => (
                  <PersonItem uuIdentity={item} subtitle={shouldShowUuIdentity ? item : null} />
                ))}
              </Grid>
            </LinkPanel>
            <Line colorScheme="neutral" significance="subdued" />
            <LinkPanel
              header={
                <>
                  <Icon icon="uugds-help" colorScheme="neutral" margin="0 8px 0 0" />
                  <Lsi lsi={{ en: `Undecided (${undecided.length})`, cs: `Nerozhodli se (${undecided.length})` }} />
                </>
              }
            >
              <Grid templateColumns={{ xs: "1fr", s: "repeat(2, 1fr)" }} style={{ marginTop: "8px" }}>
                {undecided.map((item) => (
                  <PersonItem uuIdentity={item} subtitle={shouldShowUuIdentity ? item : null} />
                ))}
              </Grid>
            </LinkPanel>
            <Line colorScheme="neutral" significance="subdued" />
            <LinkPanel
              header={
                <>
                  <Icon icon="uugdsstencil-communication-thumb-down" colorScheme="negative" margin="0 8px 0 0" />
                  <Lsi lsi={{ en: `Denied (${denied.length})`, cs: `Odmítli (${denied.length})` }} />
                </>
              }
            >
              <Grid templateColumns={{ xs: "1fr", s: "repeat(2, 1fr)" }} style={{ marginTop: "8px" }}>
                {denied.map((item) => (
                  <PersonItem uuIdentity={item} subtitle={shouldShowUuIdentity ? item : null} />
                ))}
              </Grid>
            </LinkPanel>
          </Grid>
        </Block>
      </Modal>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { AttendanceDetailModal };
export default AttendanceDetailModal;
//@@viewOff:exports
