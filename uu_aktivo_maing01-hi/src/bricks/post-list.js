//@@viewOn:imports
import { AutoLoad, createVisualComponent, Lsi, useCallback, useLsi, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import { Button, Dialog, Icon, ListItem, Panel, PlaceholderBox, ScrollableBox, Text } from "uu5g05-elements";
import PostCard from "./post-card.js";
import PostCreateBlock from "./post-create-block.js";
import UpdatePostModal from "./update-post-modal.js";
import importLsi from "../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: () => Config.Css.css({}),
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
  defaultProps: {
    data: [],
  },
  //@@viewOff:defaultProps

  render({ data, onPostCreate, onLoadNext }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const [dialogProps, setDialogProps] = useState();
    const [modalProps, setModalProps] = useState();
    const firstNotYetLoadedIndex = data ? data.findIndex((item) => item == null) : 0;
    const placeholderLsi = useLsi({ import: importLsi, path: ["Placeholder", "noPosts"] });
    //@@viewOff:private

    const showDialog = useCallback((onSubmit) => {
      setDialogProps({
        header: <Lsi import={importLsi} path={["Dialog", "deletePost", "header"]} />,
        info: <Lsi import={importLsi} path={["Dialog", "deletePost", "info"]} />,
        icon: "mdi-delete",
        actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
        actionList: [
          {
            children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
            onClick: closeDialog,
          },
          {
            children: <Lsi import={importLsi} path={["Dialog", "deletePost", "submit"]} />,
            colorScheme: "negative",
            onClick: onSubmit,
          },
        ],
      });
    }, []);
    const closeDialog = () => setDialogProps(null);
    const handlePostDelete = (item) => {
      showDialog(async () => {
        return await item.handlerMap.delete({ id: item.id });
      });
    };

    const showModal = useCallback((post, onSubmit) => {
      setModalProps({
        initialValues: post,
        onSubmit,
      });
    }, []);
    const closeModal = () => setModalProps(null);
    const handlePostUpdate = (item) => {
      showModal(item.data, async ({ data }) => {
        const { value } = data;
        return await item.handlerMap.update({ id: item.id, ...value });
      });
    };

    return (
      <>
        <ListItem colorScheme="neutral" significance="distinct" style={{ display: "grid" }}>
          <Text
            category="interface"
            segment="content"
            type={["xl", "l"].includes(screenSize) ? "large" : screenSize === "m" ? "medium" : "small"}
            bold
            style={{ padding: "4px 4px 8px" }}
          >
            <Icon icon="mdi-message-text" colorScheme="neutral" margin="0 8px 0 0" />
            <Lsi lsi={{ en: "Posts", cs: "Příspěvky" }} />
          </Text>
          <ScrollableBox
            maxHeight={420}
            minHeight={420}
            initialScrollY={window.innerHeight}
            style={{ display: "grid", rowGap: "16px", padding: "0 4px" }}
          >
            {data && firstNotYetLoadedIndex >= 0 ? (
              <Button
                children={<Lsi lsi={{ en: "Load older", cs: "Načíst starší" }} />}
                onClick={onLoadNext}
                size="s"
                colorScheme="neutral"
                significance="subdued"
                icon="mdi-chevron-up"
                iconRight="mdi-chevron-up"
              />
            ) : null}
            {data && data.length ? (
              data
                .filter((item) => item != null)
                .reverse()
                .map((item) => {
                  const { id, content, type, uuIdentity, uuIdentityName, createdAt } = item.data;
                  return (
                    <PostCard
                      key={id}
                      id={id}
                      content={content}
                      type={type}
                      uuIdentity={uuIdentity}
                      uuIdentityName={uuIdentityName}
                      createdAt={createdAt}
                      onDelete={() => handlePostDelete(item)}
                      onEdit={() => handlePostUpdate(item)}
                    />
                  );
                })
            ) : (
              <PlaceholderBox code="items" header={placeholderLsi.header} />
            )}
          </ScrollableBox>
          <PostCreateBlock onSubmit={onPostCreate} />
        </ListItem>
        <Dialog {...dialogProps} open={!!dialogProps} onClose={closeDialog} />
        <UpdatePostModal {...modalProps} open={!!modalProps} onClose={closeModal} />
      </>
    );
  },
  //@@viewOff:render
});

//@@viewOn:exports
export { PostList };
export default PostList;
//@@viewOff:exports
