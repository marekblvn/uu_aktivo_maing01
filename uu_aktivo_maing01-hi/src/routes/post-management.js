//@@viewOn:imports
import { AutoLoad, createVisualComponent, Lsi, useCallback, useLsi, useScreenSize, useState } from "uu5g05";
import { Error, withRoute } from "uu_plus4u5g02-app";
import Config from "./config/config.js";
import Container from "../bricks/container.js";
import PostListProvider from "../providers/post-list-provider.js";
import { Badge, Block, Box, DateTime, Dialog, Grid, Link, Pending, Tag, Text } from "uu5g05-elements";
import importLsi from "../lsi/import-lsi.js";
import { ControllerProvider } from "uu5tilesg02";
import { Table } from "uu5tilesg02-elements";
import { FilterBar, FilterButton, SorterButton } from "uu5tilesg02-controls";
import { ResetButton, SubmitButton, CancelButton } from "uu5g05-forms";
import { PersonItem, useAlertBus } from "uu_plus4u5g02-elements";
import UpdatePostForm from "../bricks/update-post-form.js";
import FormModal from "../bricks/form-modal.js";
import PostTable from "../bricks/post-table.js";
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

const _PostManagement = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "PostManagement",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const { showError, addAlert } = useAlertBus({ import: importLsi, path: ["Errors"] });
    const [screenSize] = useScreenSize();
    const [sorterList, setSorterList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [dialogProps, setDialogProps] = useState(null);
    const [modalProps, setModalProps] = useState(null);
    //@@viewOff:private

    const showDeletePostDialog = useCallback(
      (onConfirm) => {
        setDialogProps({
          header: <Lsi import={importLsi} path={["Dialog", "deletePost", "header"]} />,
          icon: "mdi-delete",
          info: <Lsi import={importLsi} path={["Dialog", "deletePost", "info"]} />,
          actionDirection: ["xs", "s"].includes(screenSize) ? "vertical" : "horizontal",
          actionList: [
            {
              children: <Lsi lsi={{ en: "Cancel", cs: "Zrušit" }} />,
              onClick: () => setDialogProps(null),
            },
            {
              children: <Lsi import={importLsi} path={["Dialog", "deletePost", "confirm"]} />,
              onClick: onConfirm,
              colorScheme: "negative",
            },
          ],
        });
      },
      [setDialogProps],
    );

    const showUpdatePostModal = useCallback(
      (post, onSubmit) => {
        setModalProps({
          onSubmit: onSubmit,
          header: <Lsi import={importLsi} path={["Forms", "updatePost", "header"]} />,
          footer: (
            <Grid
              templateColumns={{ xs: "auto repeat(2,1fr)", s: "repeat(3,auto)" }}
              justifyContent={{ xs: "center", s: "end" }}
            >
              <ResetButton icon="uugds-refresh" significance="subdued" />
              <CancelButton onClick={() => setModalProps(null)} />
              <SubmitButton>
                <Lsi import={importLsi} path={["Forms", "updatePost", "submit"]} />
              </SubmitButton>
            </Grid>
          ),
          children: <UpdatePostForm initialValues={post} />,
        });
      },
      [setModalProps],
    );

    const handleDeletePost = useCallback(
      (post) =>
        showDeletePostDialog(async (e) => {
          e.preventDefault();
          try {
            await post.handlerMap.delete({ id: post.id });
            setDialogProps(null);
            addAlert({
              priority: "info",
              header: { en: "Post deleted", cs: "Příspěvek smazán" },
              message: { en: "The post was successfully deleted.", cs: "Příspěvek byl úspěšně smazán." },
              durationMs: 2000,
            });
          } catch (error) {
            showError(error);
          }
        }),
      [],
    );

    const handleUpdatePost = useCallback(
      (post) =>
        showUpdatePostModal(post, async (e) => {
          e.preventDefault();
          try {
            await post.handlerMap.update({ id: post.id, ...e.data.value });
            setModalProps(null);
            addAlert({
              priority: "info",
              header: { en: "Post updated", cs: "Příspěvek upraven" },
              message: { en: "The post was successfully updated.", cs: "Příspěvek byl úspěšně upraven." },
            });
          } catch (error) {
            showError(error);
          }
        }),
      [],
    );

    const getActionList = useCallback(({ rowIndex, data }) => {
      return [
        {
          icon: "uugdsstencil-media-text-box-edit",
          tooltip: { en: "Update post", cs: "Upravit příspěvek" },
          onClick: () => handleUpdatePost(data),
        },
        {
          icon: "uugds-delete",
          tooltip: { en: "Delete post", cs: "Smazat příspěvek" },
          onClick: () => handleDeletePost(data),
          colorScheme: "negative",
        },
      ];
    }, []);

    //@@viewOn:render
    function renderLoading() {
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Pending size="xl" colorScheme="primary" />
        </div>
      );
    }

    function renderError(errorData) {
      const errorCode = errorData.error?.code;
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          return (
            <Error
              title={errorLsi[errorCode]?.header}
              subtitle={errorLsi[errorCode]?.message}
              error={errorData.error}
            />
          );
      }
    }

    function renderReady(data, handlerMap) {
      const handleChangeFilterList = (e) => {
        const filters = {};
        const sort = {};
        setFilterList(e.data.filterList);
        e.data.filterList.forEach((item) => {
          const { key, value } = item;
          filters[key] = value;
        });
        sorterList.forEach((item) => {
          const { key, ascending } = item;
          sort[key] = ascending ? 1 : -1;
        });
        handlerMap.load({ filters, sort });
      };

      const handleChangeSorterList = (e) => {
        const filters = {};
        const sort = {};
        setSorterList(e.data.sorterList);
        e.data.sorterList.forEach((item) => {
          const { key, ascending } = item;
          sort[key] = ascending ? 1 : -1;
        });
        filterList.forEach((item) => {
          const { key, value } = item;
          filters[key] = value;
        });
        handlerMap.load({ filters, sort });
      };

      const handleRefresh = () => {
        const filters = {};
        const sort = {};
        filterList.forEach((item) => {
          const { key, value } = item;
          filters[key] = value;
        });
        sorterList.forEach((item) => {
          const { key, ascending } = item;
          sort[key] = ascending ? 1 : -1;
        });
        handlerMap.load({ filters, sort });
      };

      const handleLoadNext = () => {
        const filters = {};
        const sort = {};
        filterList.forEach((item) => {
          const { key, value } = item;
          filters[key] = value;
        });
        sorterList.forEach((item) => {
          const { key, ascending } = item;
          sort[key] = ascending ? 1 : -1;
        });
        handlerMap.loadNext({ filters, sort });
      };

      return (
        <PostTable
          data={data}
          sorterList={sorterList}
          onSorterListChange={handleChangeSorterList}
          filterList={filterList}
          onFilterListChange={handleChangeFilterList}
          getActionList={getActionList}
          onRefresh={handleRefresh}
          onLoadNext={handleLoadNext}
        />
      );
    }

    return (
      <Container style={{ height: "calc(100vh - 88px)", marginTop: "12px", maxWidth: "auto" }}>
        <PostListProvider pageSize={100}>
          {({ state, data, errorData, pendingData, handlerMap }) => {
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
        <Dialog {...dialogProps} open={!!dialogProps} onClose={() => setDialogProps(null)} />
        <FormModal {...modalProps} open={!!modalProps} onClose={() => setModalProps(null)} />
      </Container>
    );
    //@@viewOff:render
  },
});

const PostManagement = withRoute(_PostManagement, { authenticated: true });

//@@viewOn:exports
export { PostManagement };
export default PostManagement;
//@@viewOff:exports
