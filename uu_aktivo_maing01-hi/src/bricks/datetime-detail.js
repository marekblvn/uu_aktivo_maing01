//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize, useSession } from "uu5g05";
import Config from "./config/config.js";
import { ListItem, Panel, Text, useAlertBus } from "uu5g05-elements";
import ParticipationList from "./participation-list.js";
import DatetimeBlock from "./datetime-block.js";
import UserParticipationBlock from "./user-participation-block.js";
import ParticipationInfoText from "./participation-info-text.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  listItem: (props) =>
    Config.Css.css({
      display: "grid",
      padding: 0,
      borderRadius: "16px",
    }),
  text: (props) =>
    Config.Css.css({
      padding: "16px 16px 16px 24px",
      backgroundColor: "rgba(117, 117, 117, 0.08)",
      borderTopRightRadius: "16px",
      borderTopLeftRadius: "16px",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const DatetimeDetail = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DatetimeDetail",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    data: {},
    onUpdateParticipation: () => {},
    idealParticipants: 0,
    minParticipants: 0,
  },
  //@@viewOff:defaultProps

  render({ data, idealParticipants, minParticipants, onUpdateParticipation }) {
    //@@viewOn:private
    let { id, datetime, undecided, confirmed, denied } = data;
    const { identity } = useSession();
    const { addAlert } = useAlertBus();
    const [screenSize] = useScreenSize();

    const userCurrentParticipationType = (() => {
      if (confirmed.includes(identity.uuIdentity)) return "confirmed";
      if (denied.includes(identity.uuIdentity)) return "denied";
      return "undecided";
    })();
    //@@viewOff:private

    const handleChangeParticipation = async ({ data }) => {
      try {
        await onUpdateParticipation({ id, type: data.value });
      } catch (error) {
        addAlert({ priority: "error", header: "Error", message: "", durationMs: 2000 });
      }
    };

    //@@viewOn:render
    return (
      <div style={{ display: "grid", rowGap: "16px" }}>
        <DatetimeBlock datetime={datetime} />
        <ParticipationInfoText
          idealParticipants={idealParticipants}
          minParticipants={minParticipants}
          confirmedCount={confirmed.length}
          deniedCount={denied.length}
          undecidedCount={undecided.length}
        />
        <UserParticipationBlock
          onChangeParticipation={handleChangeParticipation}
          userParticipationType={userCurrentParticipationType}
        />
        {["xs", "s"].includes(screenSize) ? (
          <Panel
            header={<Lsi lsi={{ en: "How did the other members decide?", cs: "Jak se rozhodli ostatní členové?" }} />}
            effect="ground"
            style={{ backgroundColor: "rgba(33, 33, 33, 0.02)" }}
            colorScheme="neutral"
          >
            <ParticipationList confirmed={confirmed} undecided={undecided} denied={denied} />
          </Panel>
        ) : (
          <ListItem colorScheme="neutral" className={Css.listItem()}>
            <Text
              category="interface"
              segment="interactive"
              type="medium"
              colorScheme="neutral"
              significance="common"
              className={Css.text()}
            >
              How did the other members decide?
            </Text>
            <div style={{ padding: "0 20px" }}>
              <ParticipationList confirmed={confirmed} undecided={undecided} denied={denied} />
            </div>
          </ListItem>
        )}
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DatetimeDetail };
export default DatetimeDetail;
//@@viewOff:exports
