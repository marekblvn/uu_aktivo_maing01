//@@viewOn:imports
import { createVisualComponent, Lsi, useScreenSize } from "uu5g05";
import Config from "./config/config.js";
import { Grid, LinkPanel, ScrollableBox, Text } from "uu5g05-elements";
import ParticipationList from "./participation-list.js";
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

const ParticipationBlock = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ParticipationBlock",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ items }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { confirmed, undecided, denied } = items;
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Grid templateRows={{ xs: "100%" }} style={{ marginTop: "8px" }}>
        {["xs", "s"].includes(screenSize) ? (
          <LinkPanel
            header={
              <Text category="story" segment="body" type="minor">
                <Lsi lsi={{ en: "How did the other members decide?", cs: "Jak se rozhodli ostatní členové?" }} />
              </Text>
            }
            colorScheme="neutral"
          >
            <ScrollableBox minHeight={"100px"} maxHeight={"400px"} style={{ paddingRight: "8px" }}>
              <ParticipationList confirmed={confirmed} undecided={undecided} denied={denied} />
            </ScrollableBox>
          </LinkPanel>
        ) : (
          <Grid templateRows={{ xs: "auto auto" }}>
            <Text category="story" segment="body" type="common" colorScheme="neutral">
              <Lsi lsi={{ en: "How did the other members decide?", cs: "Jak se rozhodli ostatní členové?" }} />
            </Text>
            <ScrollableBox height={"400px"} style={{ paddingRight: "8px" }}>
              <ParticipationList confirmed={confirmed} undecided={undecided} denied={denied} />
            </ScrollableBox>
          </Grid>
        )}
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ParticipationBlock };
export default ParticipationBlock;
//@@viewOff:exports
