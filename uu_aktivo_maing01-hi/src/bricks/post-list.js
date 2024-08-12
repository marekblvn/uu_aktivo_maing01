//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import Config from "./config/config.js";
import { PlaceholderBox, ScrollableBox, Text } from "uu5g05-elements";
import PostCard from "./post-card.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: (props) =>
    Config.Css.css({
      padding: "4px 16px",
      display: "grid",
      rowGap: "8px",
    }),
  placeholderDiv: () =>
    Config.Css.css({
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const PostList = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "PostList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ data }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render

    if (!data.length) {
      return (
        <div className={Css.placeholderDiv()}>
          <PlaceholderBox code="items" header={{ en: "Activity has no posts", cs: "Aktivita nemá žádné příspěvky" }} />
        </div>
      );
    }

    return (
      <ScrollableBox className={Css.main()} height="100%" maxHeight={563} minHeight={400} scrollbarWidth={10}>
        {data.map((item) => {
          const { id, content, type, uuIdentity, uuIdentityName, sys } = item.data;
          return (
            <PostCard
              key={id}
              id={id}
              content={content}
              type={type}
              uuIdentity={uuIdentity}
              uuIdentityName={uuIdentityName}
              createdAt={sys.cts}
            />
          );
        })}
      </ScrollableBox>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { PostList };
export default PostList;
//@@viewOff:exports
