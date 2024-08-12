//@@viewOn:imports
import { createVisualComponent, Lsi, useCallback, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import { Dialog, PlaceholderBox, ScrollableBox } from "uu5g05-elements";
import PostCard from "./post-card.js";
import PostCreateBlock from "./post-create-block.js";
import UpdatePostModal from "./update-post-modal.js";
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
      alignItems: "start",
      alignContent: "start",
    }),
  placeholderDiv: () =>
    Config.Css.css({
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "563px",
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

  render({ data, onPostCreate }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const [dialogProps, setDialogProps] = useState();
    const [modalProps, setModalProps] = useState();
    //@@viewOff:private

    const showDialog = useCallback((onSubmit) => {
      setDialogProps({
        header: (
          <Lsi
            lsi={{ en: "Are you sure you want to delete this post?", cs: "Opravdu chcete smazat tento příspěvek?" }}
          />
        ),

        info: <Lsi lsi={{ en: "This action cannot be reverted.", cs: "Tato akce nelze vrátit zpět." }} />,
        icon: "mdi-delete",
        actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
        actionList: [
          {
            children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
            onClick: closeDialog,
          },
          {
            children: <Lsi lsi={{ en: "Delete", cs: "Smazat" }} />,
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
        onSubmit: onSubmit,
      });
    }, []);
    const closeModal = () => setModalProps(null);

    const handlePostUpdate = (item) => {
      showModal(item.data, async ({ data }) => {
        const { value } = data;
        return await item.handlerMap.update({ id: item.id, ...value });
      });
    };

    //@@viewOn:render

    if (!data || !data.length) {
      return (
        <div className={Css.placeholderDiv()}>
          <PlaceholderBox code="items" header={{ en: "Activity has no posts", cs: "Aktivita nemá žádné příspěvky" }} />
        </div>
      );
    }

    return (
      <>
        <ScrollableBox className={Css.main()} maxHeight={563} minHeight={563} scrollbarWidth={10} initialScrollY={0}>
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
                onDelete={() => handlePostDelete(item)}
                onEdit={() => handlePostUpdate(item)}
              />
            );
          })}
        </ScrollableBox>
        <PostCreateBlock onSubmit={onPostCreate} />
        <Dialog {...dialogProps} open={!!dialogProps} onClose={closeDialog} />
        <UpdatePostModal {...modalProps} open={!!modalProps} onClose={closeModal} />
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { PostList };
export default PostList;
//@@viewOff:exports
