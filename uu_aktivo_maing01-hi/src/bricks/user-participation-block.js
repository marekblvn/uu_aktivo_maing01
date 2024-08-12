//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize, useSession } from "uu5g05";
import Config from "./config/config.js";
import { Box, RichIcon } from "uu5g05-elements";
import { PersonItem } from "uu_plus4u5g02-elements";
import { SwitchSelect } from "uu5g05-forms";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: (size) =>
    Config.Css.css({
      padding: ["xl", "l", "m"].includes(size) ? "8px" : "4px",
      display: "flex",
    }),
  select: () =>
    Config.Css.css({
      marginLeft: "auto",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const UserParticipationBlock = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UserParticipationBlock",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ userParticipationType, onChangeParticipation }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { identity } = useSession();

    const colorScheme = (() => {
      switch (userParticipationType) {
        case "confirmed":
          return "positive";
        case "denied":
          return "negative";
        default:
          return "neutral";
      }
    })();

    const itemList = [
      {
        value: "confirmed",
        children: (
          <>
            <RichIcon
              icon="uugdsstencil-communication-thumb-up"
              colorScheme={userParticipationType === "confirmed" ? "positive" : "dim"}
              significance="subdued"
              size={["xl", "l", "m"].includes(screenSize) ? "m" : "s"}
            />
            {["xs"].includes(screenSize) || <Lsi lsi={{ en: "Coming", cs: "Přijdu" }} />}
          </>
        ),
        colorScheme: userParticipationType === "confirmed" ? "positive" : "dim",
      },
      {
        value: "undecided",
        children: (
          <>
            <RichIcon
              icon="uugds-help"
              colorScheme={userParticipationType === "undecided" ? "neutral" : "dim"}
              significance="subdued"
              size={["xl", "l", "m"].includes(screenSize) ? "m" : "s"}
            />
            {["xs"].includes(screenSize) || <Lsi lsi={{ en: "Don't know", cs: "Nevím" }} />}
          </>
        ),
        colorScheme: userParticipationType === "undecided" ? "neutral" : "dim",
      },
      {
        value: "denied",
        children: (
          <>
            <RichIcon
              icon="uugdsstencil-communication-thumb-down"
              colorScheme={userParticipationType === "denied" ? "negative" : "dim"}
              significance="subdued"
              size={["xl", "l", "m"].includes(screenSize) ? "m" : "s"}
            />
            {["xs"].includes(screenSize) || <Lsi lsi={{ en: "Not coming", cs: "Nepřijdu" }} />}
          </>
        ),
        colorScheme: userParticipationType === "denied" ? "negative" : "dim",
      },
    ];
    //@@viewOff:private

    //@@viewOn:render(props));
    return (
      <Box
        shape="interactiveElement"
        borderRadius="moderate"
        colorScheme={colorScheme}
        className={Css.main(screenSize)}
      >
        <PersonItem
          title={<Lsi lsi={{ en: "You", cs: "Vy" }} />}
          size={screenSize === "xs" ? "s" : screenSize === "xl" ? "l" : screenSize}
          uuIdentity={identity.uuIdentity}
        />
        <SwitchSelect
          value={userParticipationType}
          size={["xl", "xs", "l"].includes(screenSize) ? "m" : screenSize}
          itemList={itemList}
          onChange={onChangeParticipation}
          className={Css.select()}
          colorScheme={colorScheme}
        />
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { UserParticipationBlock };
export default UserParticipationBlock;
//@@viewOff:exports
