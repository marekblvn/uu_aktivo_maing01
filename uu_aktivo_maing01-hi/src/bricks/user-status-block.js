//@@viewOn:imports
import { createVisualComponent, Lsi, PropTypes, useScreenSize, useSession } from "uu5g05";
import Config from "./config/config.js";
import { ActionGroup, Grid } from "uu5g05-elements";
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

const UserStatusBlock = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UserStatusBlock",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    userParticipationType: PropTypes.oneOf(["confirmed", "denied", "undecided"]),
    onChangeParticipation: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    userParticipationType: "undecided",
    onChangeParticipation: () => {},
  },
  //@@viewOff:defaultProps

  render({ userParticipationType, onChangeParticipation }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { identity } = useSession();

    const itemList = [
      {
        icon: "uugdsstencil-communication-thumb-up",
        children: ["xs", "s", "m"].includes(screenSize) ? (
          userParticipationType === "confirmed" ? (
            <Lsi lsi={{ en: "Coming", cs: "Přijdu" }} />
          ) : null
        ) : (
          <Lsi lsi={{ en: "Coming", cs: "Přijdu" }} />
        ),
        onClick: () => onChangeParticipation("confirmed"),
        colorScheme: "positive",
        significance: userParticipationType === "confirmed" ? "common" : "subdued",
      },
      { divider: true },
      {
        icon: "uugds-help",
        children: ["xs", "s", "m"].includes(screenSize) ? (
          userParticipationType === "undecided" ? (
            <Lsi lsi={{ en: "Don't know", cs: "Nevím" }} />
          ) : null
        ) : (
          <Lsi lsi={{ en: "Don't know", cs: "Nevím" }} />
        ),
        onClick: () => onChangeParticipation("undecided"),
        colorScheme: "neutral",
        significance: userParticipationType === "undecided" ? "common" : "subdued",
      },
      {
        divider: true,
      },
      {
        icon: "uugdsstencil-communication-thumb-down",
        children: ["xs", "s", "m"].includes(screenSize) ? (
          userParticipationType === "denied" ? (
            <Lsi lsi={{ en: "Not coming", cs: "Nepřijdu" }} />
          ) : null
        ) : (
          <Lsi lsi={{ en: "Not coming", cs: "Nepřijdu" }} />
        ),
        onClick: () => onChangeParticipation("denied"),
        colorScheme: "negative",
        significance: userParticipationType === "denied" ? "common" : "subdued",
      },
    ];
    //@@viewOff:private

    //@@viewOn:render(props));
    return (
      <Grid
        templateColumns={{ xs: "auto auto" }}
        templateRows={{ xs: "auto" }}
        justifyContent={{ xs: "space-between" }}
      >
        <PersonItem title={<Lsi lsi={{ en: "You", cs: "Vy" }} />} uuIdentity={identity.uuIdentity} />
        <ActionGroup itemList={itemList} />
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { UserStatusBlock };
export default UserStatusBlock;
//@@viewOff:exports
