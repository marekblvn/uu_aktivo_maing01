//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize, useSession } from "uu5g05";
import Config from "./config/config.js";
import { Box, ButtonGroup } from "uu5g05-elements";
import { PersonItem } from "uu_plus4u5g02-elements";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: (size) =>
    Config.Css.css({
      padding: ["xl", "l", "m"].includes(size) ? "8px" : "4px",
      display: "flex",
      justifyContent: "space-between",
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
        icon: "uugdsstencil-communication-thumb-up",
        children: ["xs", "s"].includes(screenSize) ? null : <Lsi lsi={{ en: "Coming", cs: "Přijdu" }} />,
        onClick: () => onChangeParticipation("confirmed"),
        colorScheme: "positive",
        significance: "subdued",
        pressed: userParticipationType === "confirmed",
      },
      {
        icon: "uugds-help",
        children: ["xs", "s"].includes(screenSize) ? null : <Lsi lsi={{ en: "Don't know", cs: "Nevím" }} />,
        onClick: () => onChangeParticipation("undecided"),
        colorScheme: "neutral",
        pressed: userParticipationType === "undecided",
      },
      {
        icon: "uugdsstencil-communication-thumb-down",
        children: ["xs", "s"].includes(screenSize) ? null : <Lsi lsi={{ en: "Not coming", cs: "Nepřijdu" }} />,
        onClick: () => onChangeParticipation("denied"),
        colorScheme: "negative",
        pressed: userParticipationType === "denied",
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
          size={["xl", "l", "m"].includes(screenSize) ? "m" : "s"}
          uuIdentity={identity.uuIdentity}
        />
        <Box borderRadius="moderate" style={{ padding: "4px" }}>
          <ButtonGroup
            itemList={itemList}
            colorScheme="building"
            significance="subdued"
            size={["xl", "l", "m"].includes(screenSize) ? "m" : "l"}
          />
        </Box>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { UserParticipationBlock };
export default UserParticipationBlock;
//@@viewOff:exports
