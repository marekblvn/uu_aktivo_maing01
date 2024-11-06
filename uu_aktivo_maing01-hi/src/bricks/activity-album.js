//@@viewOn:imports
import { createVisualComponent, PropTypes } from "uu5g05";
import Config from "./config/config.js";
import { Grid, Skeleton } from "uu5g05-elements";
import ActivityCard from "./activity-card.js";
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

const ActivityAlbum = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityAlbum",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    itemList: PropTypes.array,
    onActivityLeave: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    itemList: [],
    onActivityLeave: () => {},
  },
  //@@viewOff:defaultProps

  render({ itemList, onActivityLeave }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    function renderActivities(itemList) {
      return itemList.map((item) => {
        if (item.state === "ready") {
          const { data } = item;
          return <ActivityCard key={data.id} activity={data} onActivityLeave={() => onActivityLeave(item)} />;
        } else {
          return <Skeleton />;
        }
      });
    }

    return (
      <Grid
        templateColumns={{ xs: "100%", l: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }}
        columnGap={{ m: "16px", l: "32px" }}
        rowGap={{ m: "16px", l: "32px" }}
        style={{ marginTop: "16px", marginBottom: "16px" }}
      >
        {renderActivities(itemList)}
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityAlbum };
export default ActivityAlbum;
//@@viewOff:exports
