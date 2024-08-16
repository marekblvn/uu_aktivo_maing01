//@@viewOn:imports
import { createVisualComponent, Lsi, useLsi, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import Container from "./container.js";
import { Box, Grid, Line, ListItem, PlaceholderBox, Text } from "uu5g05-elements";
import PostListProvider from "../providers/post-list-provider.js";
import DatetimeDetail from "./datetime-detail.js";
import importLsi from "../lsi/import-lsi.js";
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

const ActivityInformationView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityInformationView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    description: "",
    location: "",
    activityId: "",
  },
  //@@viewOff:defaultProps

  render({ description, location, minParticipants, idealParticipants, activityId, datetimeId }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();

    const textType = (() => {
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
      <Container
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          rowGap: "18px",
          padding: "12px 8px 10px",
          border: "solid 1px rgb(33,33,33, 0.11)",
          borderTop: "none",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <Grid templateColumns={{ xs: "1fr", xl: "1fr 4fr" }} templateRows="repeat(1, 1fr)">
          <ListItem icon="uugds-mapmarker" colorScheme="primary" significance="common">
            <Text
              category="interface"
              segment="content"
              type={textType}
              style={{ fontStyle: location === "" ? "italic" : "normal" }}
            >
              {location || <Lsi lsi={{ en: "Activity does not have a location", cs: "Aktivita nemá lokaci" }} />}
            </Text>
          </ListItem>
          <ListItem icon="uugdsstencil-media-text-box" colorScheme="neutral" significance="common">
            <Text
              category="interface"
              segment="content"
              type={textType}
              style={{ fontStyle: description === "" ? "italic" : "normal" }}
              autoFit
            >
              {description || <Lsi lsi={{ en: "Activity does not have a description", cs: "Aktivita nemá popis" }} />}
            </Text>
          </ListItem>
        </Grid>
        <Line margin="-6px -9px" colorScheme="neutral" significance="subdued" />
        <Grid templateColumns={{ xl: "2fr 1fr", l: "3fr 2fr", xs: "100%" }}>
          <Box
            width="100%"
            style={{
              padding: "10px 8px 12px",
              boxShadow: "inset 0px 0px 5px 1px rgba(11,11,11,0.11)",
            }}
            shape="ground"
            borderRadius="moderate"
            colorScheme="secondary"
          >
            <DatetimeDetail
              datetimeId={datetimeId}
              idealParticipants={idealParticipants}
              minParticipants={minParticipants}
            />
          </Box>
          {["xs", "s"].includes(screenSize) && <Line margin="-4px -9px" colorScheme="neutral" significance="subdued" />}
          <Box
            width="100%"
            height="100%"
            shape="ground"
            significance="subdued"
            borderRadius="moderate"
            colorScheme="neutral"
          >
            <PostListProvider activityId={activityId} />
          </Box>
        </Grid>
      </Container>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityInformationView };
export default ActivityInformationView;
//@@viewOff:exports
