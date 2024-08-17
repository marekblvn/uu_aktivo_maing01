//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Block, Grid, Text } from "uu5g05-elements";
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

const ActivityInformationBlock = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityInformationBlock",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ onClickEdit, data }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { isAuthority, isExecutive } = useAuthorization();
    const { isAdministrator, isOwner } = useActivityAuthorization();
    const { name, location, description, minParticipants, idealParticipants } = data;
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Block
        card="full"
        header={
          <Text category="interface" segment="title" type={["xs", "s"].includes(screenSize) ? "micro" : "minor"}>
            <Lsi lsi={{ en: "Activity information", cs: "Informace o aktivitě" }} />
          </Text>
        }
        headerType="title"
        actionList={
          isAuthority || isExecutive || isOwner || isAdministrator
            ? [
                {
                  icon: "mdi-pencil",
                  colorScheme: "neutral",
                  significance: "common",
                  size: ["xs", "s"].includes(screenSize) ? "s" : "m",
                  onClick: onClickEdit,
                },
              ]
            : []
        }
      >
        {({ style }) => (
          <Grid
            style={style}
            templateColumns={{ xs: "100%", xl: "repeat(2, auto)" }}
            templateRows={{ xs: "repeat(4, auto)", xl: "1fr" }}
          >
            <Grid templateRows={{ xs: "auto auto", m: "auto" }} templateColumns={{ xs: "100%", m: "1fr 1fr" }}>
              <div style={{ display: "grid" }}>
                <Text
                  category="interface"
                  segment="content"
                  type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                  bold
                >
                  <Lsi lsi={{ en: "Name", cs: "Název" }} />
                </Text>
                <Text
                  category="interface"
                  segment="content"
                  type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                >
                  {name || "-"}
                </Text>
              </div>
              <div style={{ display: "grid" }}>
                <Text
                  category="interface"
                  segment="content"
                  type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                  bold
                >
                  <Lsi lsi={{ en: "Location", cs: "Lokace" }} />
                </Text>
                <Text
                  category="interface"
                  segment="content"
                  type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                >
                  {location || "-"}
                </Text>
              </div>
            </Grid>
            <div style={{ display: "grid" }}>
              <Text
                category="interface"
                segment="content"
                type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                bold
              >
                <Lsi lsi={{ en: "Description", cs: "Popis" }} />
              </Text>
              <Text category="interface" segment="content" type={["xs", "s"].includes(screenSize) ? "small" : "medium"}>
                {description || "-"}
              </Text>
            </div>
            <Grid
              templateRows={{ xs: "auto", m: "1fr" }}
              templateColumns={{ xs: "100%", m: "auto auto", xl: "1fr" }}
              rowGap="8px"
            >
              <div style={{ display: "flex", columnGap: "4px" }}>
                <Text
                  category="interface"
                  segment="content"
                  type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                  bold
                >
                  <Lsi lsi={{ en: "Min. number of participants", cs: "Minimální počet účastníků" }} />
                </Text>
                <Text
                  category="interface"
                  segment="content"
                  type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                >
                  —
                </Text>
                <Text
                  category="interface"
                  segment="content"
                  type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                >
                  {minParticipants}
                </Text>
              </div>
              <div style={{ display: "flex", columnGap: "4px" }}>
                <Text
                  category="interface"
                  segment="content"
                  type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                  bold
                >
                  <Lsi lsi={{ en: "Ideal number of participants", cs: "Ideální počet účastníků" }} />
                </Text>
                <Text
                  category="interface"
                  segment="content"
                  type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                >
                  —
                </Text>
                <Text
                  category="interface"
                  segment="content"
                  type={["xs", "s"].includes(screenSize) ? "small" : "medium"}
                >
                  {idealParticipants}
                </Text>
              </div>
            </Grid>
          </Grid>
        )}
      </Block>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityInformationBlock };
export default ActivityInformationBlock;
//@@viewOff:exports
