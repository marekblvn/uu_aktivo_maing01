//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize, useSession, useRoute } from "uu5g05";
import Config from "./config/config.js";
import { Block, Button, Header, Icon, Text } from "uu5g05-elements";
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

const ActivityCard = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityCard",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    activity: {
      id: "",
      name: "",
      description: "",
      owner: "",
      administrators: [],
    },
    onActivityLeave: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { activity, onActivityLeave } = props;
    const [screenSize] = useScreenSize();
    const { identity } = useSession();
    const [, setRoute] = useRoute();

    const actionItems = [
      {
        children: <Lsi lsi={{ en: "Open in new tab", cs: "Otevřít v nové kartě" }} />,
        onClick: () => {
          const urlSplit = window.location.href.split("/");
          const urlBase = urlSplit.splice(0, urlSplit.length - 1).join("/");
          window.open(`${urlBase}/activity?id=${activity.id}`, "_blank");
        },
        collapsed: true,
        icon: "mdi-open-in-new",
        colorScheme: "neutral",
        significance: "common",
      },
      {
        children: <Lsi lsi={{ en: "Leave activity", cs: "Opustit aktivitu" }} />,
        onClick: onActivityLeave,
        collapsed: true,
        icon: "mdi-account-minus",
        colorScheme: "negative",
        significance: screenSize === "xs" ? "distinct" : "common",
        disabled: activity.owner === identity.uuIdentity,
      },
    ];
    //@@viewOff:private

    //@@viewOn:render
    function renderIcon() {
      if (activity.owner === identity.uuIdentity) {
        return (
          <Icon
            icon="mdi-crown"
            tooltip={{ en: "You're the owner of this activity", cs: "Jste vlastníkem této aktivity" }}
            style={{ color: "rgb(218,165,32)", marginBottom: "2px" }}
          />
        );
      } else if (activity.administrators.includes(identity.uuIdentity)) {
        return (
          <Icon
            icon="mdi-police-badge"
            tooltip={{ en: "You're an administrator in this activity", cs: "Jste správcem této aktivity" }}
            style={{ color: "rgb(117, 145, 170)" }}
          />
        );
      } else {
        return null;
      }
    }

    return (
      <Block
        card="full"
        header={
          <Header
            title={
              <div style={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
                {renderIcon()}
                <Text category="interface" segment="title" type={`${screenSize === "xs" ? "micro" : "minor"}`} autoFit>
                  {activity.name}
                </Text>
              </div>
            }
          />
        }
        actionList={actionItems}
        footer={
          <div style={{ display: "flex", width: "100%" }}>
            <Button
              width={screenSize === "xs" ? "100%" : "200px"}
              colorScheme="primary"
              significance="highlighted"
              onClick={() => setRoute("activity", { id: activity.id })}
              style={{ marginLeft: "auto" }}
              size={["xl", "l"].includes(screenSize) ? "m" : "s"}
            >
              <Lsi lsi={{ en: "Open Activity", cs: "Otevřít aktivitu" }} />
            </Button>
          </div>
        }
      >
        {activity.description.length > 0 && (
          <Text
            category="interface"
            segment="content"
            type={["xl", "l"].includes(screenSize) ? "large" : screenSize === "m" ? "medium" : "small"}
            autoFit
            colorScheme="building"
            significance="subdued"
            style={{ textAlign: "justify" }}
          >
            {activity.description}
          </Text>
        )}
      </Block>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityCard };
export default ActivityCard;
//@@viewOff:exports
