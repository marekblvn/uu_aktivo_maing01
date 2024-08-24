//@@viewOn:imports
import { createVisualComponent, Fragment, Lsi, useCallback, useLsi, useScreenSize, useState } from "uu5g05";
import Config from "./config/config.js";
import PostListProvider from "../providers/post-list-provider.js";
import { Button, Dialog, Grid, Pending, PlaceholderBox, RichIcon, ScrollableBox, Text } from "uu5g05-elements";
import PostCreateBlock from "./post-create-block.js";
import { Error, useAlertBus } from "uu_plus4u5g02-elements";
import importLsi from "../lsi/import-lsi.js";
import PostCard from "./post-card.js";
import FormModal from "./form-modal.js";
import { CancelButton, ResetButton, SubmitButton } from "uu5g05-forms";
import UpdatePostForm from "./update-post-form.js";
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

const PostBlock = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "PostBlock",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ activityId }) {
    //@@viewOn:private
    const [screenSize] = useScreenSize();
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const placeholderLsi = useLsi({ import: importLsi, path: ["Placeholder", "noPosts"] });
    const [dialogProps, setDialogProps] = useState(null);
    const [modalProps, setModalProps] = useState(null);
    const [initialScroll, setInitialScroll] = useState(window.innerHeight + 576);
    //@@viewOff:private

    const showDeleteDialog = useCallback(
      (onConfirm) => {
        setDialogProps({
          header: <Lsi import={importLsi} path={["Dialog", "deletePost", "header"]} />,
          info: <Lsi import={importLsi} path={["Dialog", "deletePost", "info"]} />,
          icon: "mdi-delete",
          actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
          actionList: [
            {
              children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
              onClick: () => setDialogProps(null),
            },
            {
              children: <Lsi import={importLsi} path={["Dialog", "deletePost", "confirm"]} />,
              colorScheme: "negative",
              onClick: onConfirm,
            },
          ],
        });
      },
      [setDialogProps],
    );

    const showUpdatePostForm = useCallback((post, onSubmit) => {
      setModalProps({
        open: true,
        onClose: () => setModalProps(null),
        onSubmit: onSubmit,
        header: <Lsi import={importLsi} path={["Forms", "updatePost", "header"]} />,
        footer: (
          <Grid
            templateColumns={{ xs: "auto repeat(2,1fr)", s: "repeat(3, auto)" }}
            justifyContent={{ xs: "center", s: "end" }}
          >
            <ResetButton icon="uugds-refresh" significance="subdued" />
            <CancelButton onClick={() => setModalProps(null)} />
            <SubmitButton>
              <Lsi import={importLsi} path={["Forms", "updatePost", "submit"]} />
            </SubmitButton>
          </Grid>
        ),
        children: <UpdatePostForm initialValues={post.data} />,
      });
    });

    //@@viewOn:render
    function renderLoading() {
      return (
        <Grid templateColumns={{ xs: "100%" }} templateRows={{ xs: "auto 46px" }} style={{ position: "relative" }}>
          <div
            style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Pending size="l" colorScheme="neutral" />
          </div>
          <PostCreateBlock disabled={true} inputProps={{ autoResize: false }} />
        </Grid>
      );
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          const errorCode = errorData.error?.code;
          return (
            <Error
              title={errorLsi[errorCode]?.header || { en: "Something went wrong", cs: "Něco se pokazilo" }}
              subtitle={errorLsi[errorCode]?.message || errorData.error?.code}
              error={errorData.error}
            />
          );
      }
    }

    function renderReady(data, handlerMap) {
      const firstNotYetLoadedIndex = data ? data.findIndex((item) => item == null) : 0;

      const handleCreatePost = async (value) => {
        try {
          await handlerMap.create({ activityId, type: "normal", content: value });
          await handlerMap.load({ filters: { activityId }, sort: { createdAt: -1 } });
        } catch (error) {
          showError(error);
        }
      };

      const handlePostDelete = (item) => {
        showDeleteDialog(async (e) => {
          e.preventDefault();
          try {
            await item.handlerMap.delete({ id: item.data.id });
            setDialogProps(null);
            addAlert({
              priority: "info",
              header: { en: "Post deleted", cs: "Příspěvek smazán" },
              message: {
                en: "The post you chose to delete was successfully deleted.",
                cs: "Vámi vybraný příspěvek byl úspěšně smazán.",
              },
            });
          } catch (error) {
            showError(error);
          }
        });
      };

      const handleUpdatePost = (item) => {
        showUpdatePostForm(item, async (e) => {
          e.preventDefault();
          try {
            await item.handlerMap.update({ id: item.data.id, ...e.data.value });
            setModalProps(null);
            addAlert({
              priority: "info",
              header: { en: "Post updated", cs: "Příspěvek upraven" },
              message: { en: "The post was successfully updated.", cs: "Příspěvek byl úspěšně upraven." },
            });
          } catch (error) {
            showError(error);
          }
        });
      };

      const handleLoadOlderPosts = async () => {
        await handlerMap.loadNext({ filters: { activityId }, sort: { createdAt: -1 } });
        setInitialScroll(0);
      };

      return (
        <Fragment>
          <ScrollableBox maxHeight="576px" minHeight="576px" initialScrollY={initialScroll} disableOverscroll>
            {data && firstNotYetLoadedIndex >= 0 ? (
              <Button
                children={<Lsi lsi={{ en: "Load older posts", cs: "Načíst starší příspěvky" }} />}
                colorScheme="steel"
                significance="subdued"
                onClick={handleLoadOlderPosts}
                width="100%"
                icon="uugdsstencil-arrow-chevron-double-up"
                iconRight="uugdsstencil-arrow-chevron-double-up"
                size="xs"
                style={{ backgroundColor: "transparent" }}
              />
            ) : null}
            {data && data.length ? (
              data
                .filter((item) => item != null)
                .reverse()
                .map((item) => {
                  return (
                    <PostCard
                      key={item.data.id}
                      {...item.data}
                      onDelete={() => handlePostDelete(item)}
                      onEdit={() => handleUpdatePost(item)}
                    />
                  );
                })
            ) : (
              <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <PlaceholderBox code="items" header={placeholderLsi.header} />
              </div>
            )}
          </ScrollableBox>
          <PostCreateBlock inputProps={{ autoResize: true }} onSubmit={handleCreatePost} />
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Grid
          templateColumns={{ xs: "100%" }}
          templateRows={{ xs: "40px auto" }}
          rowGap={0}
          style={{
            border: "solid 1px rgba(0,0,0,0.4)",
            borderRadius: "8px",
            padding: "0 8px",
            height: "669px",
            position: "relative",
          }}
        >
          <div
            style={{
              padding: "0px 8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              columnGap: 0,
              borderBottom: "solid 1px rgba(0,0,0,0.09)",
            }}
          >
            <RichIcon icon="uugds-comment-text" colorScheme="building" significance="subdued" />
            <Text category="story" segment="body" type={["xs", "s"].includes(screenSize) ? "minor" : "common"}>
              <Lsi lsi={{ en: "Posts", cs: "Příspěvky" }} />
            </Text>
          </div>
          <PostListProvider filters={{ activityId }} sort={{ createdAt: -1 }} pageSize={10}>
            {({ state, data, pendingData, errorData, handlerMap }) => {
              switch (state) {
                case "pendingNoData":
                  return renderLoading();
                case "errorNoData":
                  return renderError(errorData);
                case "error":
                  showError(errorData.error);
                case "pending":
                case "ready":
                case "readyNoData":
                  return renderReady(data, handlerMap);
              }
            }}
          </PostListProvider>
        </Grid>
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
        <FormModal {...modalProps} />
      </Fragment>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { PostBlock };
export default PostBlock;
//@@viewOff:exports
