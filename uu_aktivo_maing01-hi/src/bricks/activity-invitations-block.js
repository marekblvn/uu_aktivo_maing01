//@@viewOn:imports
import { createVisualComponent, Fragment, Lsi, AutoLoad, PropTypes, useState, useLsi } from "uu5g05";
import { Error, PersonItem } from "uu_plus4u5g02-elements";
import { Line, LinkPanel, Text, Icon, Pending, ActionGroup, PlaceholderBox, Box, DateTime } from "uu5g05-elements";
import { List } from "uu5tilesg02-elements";
import InvitationListProvider from "../providers/invitation-list-provider.js";
import Config from "./config/config.js";
import importLsi from "../lsi/import-lsi.js";
import { useAuthorization } from "../contexts/authorization-context.js";
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

const ActivityInvitationsBlock = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityInvitationsBlock",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    activityId: PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    activityId: "",
  },
  //@@viewOff:defaultProps

  render({ activityId, onDeleteInvitation, onCreateInvitation }) {
    //@@viewOn:private
    const [openInvitations, setOpenInvitations] = useState(false);
    const errorLsi = useLsi({ import: importLsi, path: ["Errors"] });
    const { isAuthority, isExecutive } = useAuthorization();
    //@@viewOff:private

    function renderLoading() {
      return <Pending size="xl" colorScheme="primary" />;
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
          const errorCode = errorData.error?.code;
          return (
            <Error title={errorLsi[errorCode]?.header} subtitle={errorLsi[errorCode]?.info} error={errorData.error} />
          );
      }
    }

    function renderReady(data, handlerMap) {
      const getActionList = ({ rowIndex, data }) => {
        return [
          {
            icon: "mdi-email-remove-outline",
            tooltip: { en: "Delete invitation", cs: "Smazat pozvánku" },
            onClick: () => onDeleteInvitation(data),
          },
        ];
      };

      const dataToRender = data.map((item) => ({ ...item.data, handlerMap: item.handlerMap }));

      return (
        <Fragment>
          <ActionGroup
            itemList={[
              {
                icon: "mdi-account-plus",
                children: <Lsi lsi={{ en: "Invite user to activity", cs: "Pozvat uživatele do aktivity" }} />,
                onClick: () => onCreateInvitation(handlerMap.create),
                significance: "subdued",
                colorScheme: "steel",
              },
            ]}
            style={{ margin: "-12px 0 4px" }}
          />
          <List
            data={dataToRender}
            verticalAlignment="center"
            getActionList={getActionList}
            emptyState={
              <PlaceholderBox code="items" header={{ en: "No invited users", cs: "Žádní pozvaní uživatelé" }} />
            }
            columnList={[
              {
                value: "uuIdentity",
                header: <Lsi lsi={{ en: "User", cs: "Uživatel" }} />,
                cell: ({ data }) => (
                  <PersonItem
                    uuIdentity={data.uuIdentity}
                    subtitle={isAuthority || isExecutive ? data.uuIdentity : null}
                  />
                ),
              },
              {
                value: "createdAt",
                header: <Lsi lsi={{ en: "Invitation created", cs: "Pozván" }} />,
                cell: ({ data }) => <DateTime value={data.createdAt} timeFormat="short" />,
              },
            ]}
          >
            {({ data }) => {
              return (
                <Box borderRadius="moderate" style={{ padding: "8px", display: "flex" }}>
                  <PersonItem
                    uuIdentity={data.uuIdentity}
                    subtitle={<DateTime value={data.createdAt} />}
                    direction="vertical"
                  />
                  <ActionGroup
                    itemList={[
                      {
                        icon: "mdi-email-remove-outline",
                        onClick: () => onDeleteInvitation(data),
                      },
                    ]}
                  />
                </Box>
              );
            }}
          </List>
          <AutoLoad
            data={data}
            handleLoadNext={() => handlerMap.loadNext({ filters: { activityId } })}
            distance={window.innerHeight}
          />
        </Fragment>
      );
    }

    //@@viewOn:render
    return (
      <Fragment>
        <Line colorScheme="neutral" significance="subdued" margin="16px 0" />
        <LinkPanel
          open={openInvitations}
          onChange={(e) => setOpenInvitations(e.data.open)}
          header={
            <Text category="interface" segment="highlight" type="common" autoFit>
              <Icon icon={"mdi-card-account-mail-outline"} colorScheme={"neutral"} margin={{ right: "4px" }} />
              <Lsi lsi={{ en: "Invited", cs: "Pozvaní" }} />
            </Text>
          }
        >
          <InvitationListProvider filters={{ activityId }} pageSize={10}>
            {({ state, data, pendingData, errorData, handlerMap }) => {
              switch (state) {
                case "pendingNoData":
                  return renderLoading();
                case "error":
                case "errorNoData":
                  return renderError(errorData);
                case "pending":
                case "ready":
                case "readyNoData":
                  return renderReady(data, handlerMap);
              }
            }}
          </InvitationListProvider>
        </LinkPanel>
      </Fragment>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityInvitationsBlock };
export default ActivityInvitationsBlock;
//@@viewOff:exports
