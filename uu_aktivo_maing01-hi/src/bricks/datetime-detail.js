//@@viewOn:imports
import { createVisualComponent, Lsi, useLsi, useScreenSize, useSession } from "uu5g05";
import Config from "./config/config.js";
import { ListItem, Panel, Pending, Text } from "uu5g05-elements";
import ParticipationList from "./participation-list.js";
import DatetimeBlock from "./datetime-block.js";
import UserParticipationBlock from "./user-participation-block.js";
import ParticipationInfoText from "./participation-info-text.js";
import { Error, useAlertBus } from "uu_plus4u5g02-elements";
import DatetimeProvider from "../providers/datetime-provider.js";
import importLsi from "../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  listItem: (props) =>
    Config.Css.css({
      display: "grid",
      padding: 0,
      borderRadius: "8px",
    }),
  text: (props) =>
    Config.Css.css({
      padding: "16px 16px 16px 24px",
      backgroundColor: "rgba(117, 117, 117, 0.08)",
      borderTopRightRadius: "8px",
      borderTopLeftRadius: "8px",
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
    onUpdateParticipation: () => {},
    idealParticipants: 0,
    minParticipants: 0,
  },
  //@@viewOff:defaultProps

  render({ idealParticipants, minParticipants, datetimeId }) {
    //@@viewOn:private
    const { identity } = useSession();
    const { showError } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const [screenSize] = useScreenSize();
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });

    function renderLoading() {
      return <Pending size="l" colorScheme="secondary" type="horizontal" />;
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          const errorCode = errorData.error?.code;
          return (
            <Error
              title={errorLsi[errorCode]?.header || { en: "Something went wrong", cs: "Něco se pokazilo" }}
              subtitle={errorLsi[errorCode]?.message || errorData.error?.code}
              error={errorData.error}
            />
          );
      }
    }

    function renderReady(data, handlerMap) {
      if (!data) return null;

      const { id, datetime, undecided, confirmed, denied } = data;

      const userCurrentParticipationType = (() => {
        if (confirmed.includes(identity.uuIdentity)) return "confirmed";
        if (denied.includes(identity.uuIdentity)) return "denied";
        return "undecided";
      })();

      const handleChangeParticipation = async ({ data }) => {
        try {
          await handlerMap.updateParticipation({ id, type: data.value });
        } catch (error) {
          showError(e);
        }
      };

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
          {["xs", "s", "m"].includes(screenSize) ? (
            <Panel
              header={
                <Text category="interface" segment="content" type={screenSize === "m" ? "medium" : "small"}>
                  <Lsi lsi={{ en: "How did the other members decide?", cs: "Jak se rozhodli ostatní členové?" }} />
                </Text>
              }
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
                <Lsi lsi={{ en: "How did the other members decide?", cs: "Jak se rozhodli ostatní členové?" }} />
              </Text>
              <div style={{ padding: "0 20px" }}>
                <ParticipationList confirmed={confirmed} undecided={undecided} denied={denied} />
              </div>
            </ListItem>
          )}
        </div>
      );
    }

    //@@viewOn:render

    //@@viewOff:private

    //@@viewOn:render
    return (
      <DatetimeProvider datetimeId={datetimeId}>
        {({ state, data, pendingData, errorData, handlerMap }) => {
          switch (state) {
            case "pending":
              return renderReady(data, handlerMap);
            case "pendingNoData":
              return renderLoading();
            case "error":
              return renderReady(data, handlerMap);
            case "errorNoData":
              return renderError(errorData);
            case "ready":
            case "readyNoData":
              return renderReady(data, handlerMap);
          }
        }}
      </DatetimeProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DatetimeDetail };
export default DatetimeDetail;
//@@viewOff:exports
