//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { ActionGroup, Button, Grid, ListLayout, Text } from "uu5g05-elements";
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

const ActivitySettingsBlock = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivitySettingsBlock",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ onClickEdit, data, onClickTransferOwnership, onClickDeleteActivity }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { isAuthority, isExecutive } = useAuthorization();
    const { isAdministrator, isOwner } = useActivityAuthorization();
    const { name, location, description, minParticipants, idealParticipants, datetimeId, members } = data;
    //@@viewOff:private

    //@@viewOn:render

    return (
      <Grid rowGap={{ xs: 2, l: 16 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text category="interface" segment="title" type={["xl", "l", "m"].includes(screenSize) ? "minor" : "micro"}>
            <Lsi lsi={{ en: "Activity settings", cs: "Nastavení aktivity" }} />
          </Text>
          <ActionGroup
            itemList={
              isAdministrator || isOwner || isExecutive || isAuthority
                ? [
                    {
                      icon: "mdi-pencil",
                      onClick: onClickEdit,
                    },
                  ]
                : []
            }
          />
        </div>
        <ListLayout
          itemList={[
            {
              label: { en: "Name", cs: "Název" },
              children: name,
            },
            {
              label: { en: "Location", cs: "Lokace" },
              children: location || "—",
            },
            {
              label: { en: "Description", cs: "Popis" },
              children: description || "—",
            },
            {
              label: { en: "Min. number of participants", cs: "Min. počet účastníků" },
              info: {
                en: "How many participants are necessary for the activity?",
                cs: "Kolik účastníků je potřeba na aktivitu aby mohla proběhnout?",
              },
              children: minParticipants,
            },
            {
              label: { en: "Ideal number of participants", cs: "Ideální počet účastníků" },
              info: {
                en: "What number of participants is ideal for the activity?",
                cs: "Kolik účastníků by ideálně mělo přijít?",
              },
              children: idealParticipants,
            },
          ]}
          collapsibleItemList={
            isOwner || isAuthority || isExecutive
              ? [
                  {
                    label: { en: "Transfer activity ownership", cs: "Převést vlastnictví aktivity" },
                    children: (
                      <Button
                        colorScheme="warning"
                        significance="distinct"
                        onClick={onClickTransferOwnership}
                        style={{ margin: "8px 0" }}
                        disabled={datetimeId !== null || members.length === 1}
                      >
                        <Lsi lsi={{ en: "Transfer activity ownership", cs: "Převést vlastnictví aktivity" }} />
                      </Button>
                    ),
                  },
                  {
                    label: { en: "Delete activity", cs: "Smazat aktivitu" },
                    children: (
                      <Button
                        colorScheme="negative"
                        significance="distinct"
                        style={{ margin: "8px 0" }}
                        onClick={onClickDeleteActivity}
                      >
                        <Lsi lsi={{ en: "Delete activity", cs: "Smazat aktivitu" }} />
                      </Button>
                    ),
                  },
                ]
              : null
          }
        />
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivitySettingsBlock };
export default ActivitySettingsBlock;
//@@viewOff:exports
