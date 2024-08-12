//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize, useSession } from "uu5g05";
import Config from "./config/config.js";
import { ActionGroup, Box, DateTime, Text } from "uu5g05-elements";
import { PersonItem } from "uu_plus4u5g02-elements";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  box: (type) =>
    Config.Css.css({
      padding: "8px",
      display: "grid",
      border: type === "important" ? "solid 2px rgba(244, 67, 54, 0.65)" : "",
      backgroundColor: type === "important" ? "rgba(244, 67, 54, 0.12)" : "",
    }),
  headerDiv: () =>
    Config.Css.css({
      display: "flex",
      marginBottom: "4px",
    }),
  text: () =>
    Config.Css.css({
      padding: "8px 8px 4px",
      textAlign: "left",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const PostCard = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "PostCard",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ id, content, type, createdAt, uuIdentity, uuIdentityName }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { identity } = useSession();
    const itemList = [
      {
        children: <Lsi lsi={{ en: "Edit", cs: "Upravit" }} />,
        icon: "mdi-pencil",
        collapsed: true,
        order: -1,
        onClick: () => {},
        colorScheme: "steel",
      },
      { divider: true },
      {
        children: <Lsi lsi={{ en: "Delete", cs: "Smazat" }} />,
        icon: "mdi-delete",
        collapsed: true,
        onClick: () => {},
        colorScheme: "negative",
      },
    ];

    const contentTextType = (() => {
      switch (screenSize) {
        case "xl":
        case "l":
          return "large";
        case "m":
          return "medium";
        case "s":
        case "xs":
          return "small";
      }
    })();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Box shape="ground" significance="common" borderRadius="moderate" colorScheme="neutral" className={Css.box(type)}>
        <div className={Css.headerDiv()}>
          <PersonItem
            uuIdentity={uuIdentity}
            title={uuIdentityName}
            subtitle={<DateTime value={createdAt} timeFormat="short" dateFormat="medium" />}
            direction={screenSize === "xs" ? "vertical" : "horizontal"}
          />
          {uuIdentity === identity.uuIdentity && <ActionGroup size="s" itemList={itemList} />}
        </div>
        <Text className={Css.text()} autoFit category="interface" segment="content" type={contentTextType}>
          {content}
        </Text>
      </Box>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { PostCard };
export default PostCard;
//@@viewOff:exports
