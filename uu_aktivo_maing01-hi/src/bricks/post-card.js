//@@viewOn:imports
import { createVisualComponent, Fragment, Lsi, useScreenSize, useSession } from "uu5g05";
import Config from "./config/config.js";
import { ActionGroup, Box, DateTime, Text } from "uu5g05-elements";
import { useActivityAuthorization } from "../contexts/activity-authorization-context.js";
import { useAuthorization } from "../contexts/authorization-context.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: Config.Css.css({}),
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

  render({ onEdit, onDelete, ...props }) {
    const { id, content, type, createdAt, uuIdentity, uuIdentityName } = props;
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { identity } = useSession();
    const { isAuthority, isExecutive } = useAuthorization();
    const { isOwner, isAdministrator, checkIfAdministrator, checkIfOwner } = useActivityAuthorization();

    const getActionList = () => {
      const list = [];
      if (
        isAuthority ||
        isExecutive ||
        isOwner ||
        (isAdministrator && !checkIfOwner(uuIdentity) && !checkIfAdministrator(uuIdentity)) ||
        uuIdentity === identity.uuIdentity
      ) {
        list.push({
          children: <Lsi lsi={{ en: "Delete", cs: "Smazat" }} />,
          icon: "mdi-delete",
          collapsed: true,
          onClick: onDelete,
          colorScheme: "negative",
        });
      }

      if (uuIdentity === identity.uuIdentity) {
        list.push({
          children: <Lsi lsi={{ en: "Edit", cs: "Upravit" }} />,
          icon: "mdi-pencil",
          collapsed: true,
          order: -1,
          onClick: onEdit,
          colorScheme: "steel",
        });
      }
      return list;
    };
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Box
        shape="ground"
        significance="common"
        borderRadius="moderate"
        colorScheme="building"
        style={{
          margin: "8px",
          padding: "10px 12px 10px 16px",
          border: type === "important" ? "solid 1px rgb(255,165,0)" : "none",
          backgroundColor: type === "important" ? "rgba(255,165,0, 0.2)" : "rgb(255,255,255)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", columnGap: "8px" }}>
          <Fragment>
            <Text
              category="story"
              segment="body"
              type={["xs", "s"].includes(screenSize) ? "minor" : "common"}
              colorScheme="neutral"
            >
              {uuIdentityName}
            </Text>
            <Text
              category="story"
              segment="body"
              type={["xs", "s"].includes(screenSize) ? "minor" : "common"}
              colorScheme="dim"
              significance="subdued"
              style={{ fontStyle: "italic" }}
            >
              <DateTime value={createdAt} format="DD.MM.YY HH:mm" />
            </Text>
          </Fragment>
          {uuIdentity === identity.uuIdentity && <ActionGroup size="s" itemList={getActionList()} />}
        </div>
        <Text category="story" segment="body" type={["xs", "s"].includes(screenSize) ? "minor" : "common"}>
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
