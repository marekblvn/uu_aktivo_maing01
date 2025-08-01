//@@viewOn:imports
import { createVisualComponent, Lsi, PropTypes, useScreenSize, useSession, useState } from "uu5g05";
import Config from "./config/config.js";
import { Grid, Line, LinkPanel, RichIcon, Text } from "uu5g05-elements";
import DatetimeDetail from "./datetime-detail.js";
import PostBlock from "./post-block.js";
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
  propTypes: {
    data: PropTypes.object,
    onReload: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    data: {
      description: "",
      location: "",
      id: "",
    },
    onReload: () => {},
  },
  //@@viewOff:defaultProps

  render({ data, onReload }) {
    //@@viewOn:private
    const {
      description,
      location,
      members,

      id: activityId,
    } = data;
    const [screenSize] = useScreenSize();
    const { identity } = useSession();
    const [openDescription, setOpenDescription] = useState(false);
    const isMember = members.some((member) => member.uuIdentity === identity.uuIdentity);
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Grid
        style={{
          padding: "16px",
          border: "solid 1px rgb(33,33,33, 0.11)",
          borderTop: "none",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
        templateColumns={{ xs: "100%" }}
        templateRows={{ xs: "auto 1fr" }}
      >
        <Grid templateColumns={{ xs: "1fr", xl: "1fr 3fr" }} templateRows="repeat(1, 1fr)">
          <Grid
            rowGap={0}
            templateRows={{ xs: "100%" }}
            templateColumns={{ xs: "24px auto" }}
            alignItems="center"
            style={{ border: "solid 1px rgb(100, 124, 138)", padding: "8px 8px 8px 4px", borderRadius: "8px" }}
          >
            <RichIcon
              icon="uugdsstencil-navigation-mapmarker-solid"
              colorScheme="steel"
              significance="subdued"
              tooltip={{ en: "Location", cs: "Lokace" }}
            />
            <Text category="story" segment="body" type={["xs", "s"].includes(screenSize) ? "minor" : "common"}>
              {location || "—"}
            </Text>
          </Grid>
          <Grid
            rowGap={0}
            templateRows={{ xs: "100%" }}
            templateColumns={{ xs: "24px auto" }}
            alignItems={{ xs: "start", l: "center" }}
            style={{ border: "solid 1px rgb(100, 124, 138)", padding: "8px 8px 8px 4px", borderRadius: "8px" }}
          >
            <RichIcon
              icon="uugdsstencil-media-text-box"
              colorScheme="steel"
              significance="subdued"
              tooltip={{ en: "Description", cs: "Popis" }}
            />
            {["xs", "s", "m"].includes(screenSize) ? (
              <LinkPanel
                header={
                  <Text category="story" segment="body" type={["xs", "s"].includes(screenSize) ? "minor" : "common"}>
                    <Lsi lsi={{ en: "Description", cs: "Popis" }} />
                  </Text>
                }
                open={openDescription}
                onChange={(e) => setOpenDescription(e.data.open)}
                style={{ marginTop: "8px" }}
              >
                <Text category="story" segment="body" type={["xs", "s"].includes(screenSize) ? "minor" : "common"}>
                  {description || "—"}
                </Text>
              </LinkPanel>
            ) : (
              <Text category="story" segment="body" type={["xs", "s"].includes(screenSize) ? "minor" : "common"}>
                {description || "—"}
              </Text>
            )}
          </Grid>
        </Grid>
        <Line colorScheme="neutral" significance="subdued" />
        <Grid
          templateColumns={{ xl: "2fr 1fr", m: "3fr 2fr", xs: "100%" }}
          templateRows={{ xs: "auto auto", m: "100%" }}
        >
          <DatetimeDetail activity={data} onReload={onReload} isMember={isMember} />
          <PostBlock activityId={activityId} />
        </Grid>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityInformationView };
export default ActivityInformationView;
//@@viewOff:exports
