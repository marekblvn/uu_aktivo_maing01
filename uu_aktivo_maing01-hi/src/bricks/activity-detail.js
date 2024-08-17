//@@viewOn:imports
import {
  createVisualComponent,
  Lsi,
  useEffect,
  useLsi,
  useRoute,
  useRouteLeave,
  useScreenSize,
  useSession,
  useState,
} from "uu5g05";
import Config from "./config/config.js";
import { Header, PlaceholderBox, Tabs } from "uu5g05-elements";
import ActivityInformationView from "./activity-information-view.js";
import ActivityMembersView from "./activity-members-view.js";
import ActivitySettingsView from "./activity-settings-view.js";
import importLsi from "../lsi/import-lsi.js";
import { useAuthorization } from "../contexts/authorization-context.js";
import { useActivityAuthorization } from "../contexts/activity-authorization-context.js";
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

const ActivityDetail = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityDetail",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    data: {},
    handlerMap: {},
  },
  //@@viewOff:defaultProps

  render({ data, handlerMap }) {
    //@@viewOn:private
    const {
      id,
      name,
      location,
      description,
      members,
      administrators,
      owner,
      idealParticipants,
      minParticipants,
      datetimeId,
    } = data;
    const [screenSize] = useScreenSize();
    const { identity } = useSession();
    const [, setRoute] = useRoute();
    const { nextRoute, allow } = useRouteLeave();
    const [activeTab, setActiveTab] = useState("info");
    const placeholderLsi = useLsi({ import: importLsi, path: ["Placeholder", "notFound"] });
    const { isAuthority, isExecutive } = useAuthorization();
    const { isAdministrator, isOwner } = useActivityAuthorization();

    useEffect(() => {
      const lastTab = sessionStorage.getItem("lastTabCode");
      if (lastTab) {
        setActiveTab(lastTab);
      }
    }, []);

    useEffect(() => {
      sessionStorage.setItem("lastTabCode", activeTab);
    }, [activeTab]);

    useEffect(() => {
      if (nextRoute) {
        sessionStorage.removeItem("lastTabCode");
        allow();
      }
    }, [nextRoute]);

    const tabItemList = [
      {
        label: <Lsi lsi={{ en: "Information", cs: "Informace" }} />,
        icon: activeTab === "info" ? "mdi-information" : "mdi-information-outline",
        code: "info",
      },
      {
        label: <Lsi lsi={{ en: "Members", cs: "Členové" }} />,
        icon: activeTab === "members" ? "mdi-account-multiple" : "mdi-account-multiple-outline",
        code: "members",
      },
    ];
    if (isOwner || isAdministrator || isAuthority || isExecutive) {
      tabItemList.push({
        label: <Lsi lsi={{ en: "Settings", cs: "Nastavení" }} />,
        icon: activeTab === "settings" ? "mdi-cog" : "mdi-cog-outline",
        code: "settings",
      });
    }
    //@@viewOff:private

    function handleChangeTab({ activeCode }) {
      setActiveTab(activeCode);
    }

    const handleReload = async (id) => {
      return await handlerMap.load({ id });
    };

    const handleAddAdministrator = async (uuIdentity) => {
      return await handlerMap.addAdministrator({ id, uuIdentity });
    };

    const handleRemoveMember = async (uuIdentity) => {
      return await handlerMap.removeMember({ id, uuIdentity });
    };

    const handleRemoveAdministrator = async (uuIdentity) => {
      return await handlerMap.removeAdministrator({ id, uuIdentity });
    };

    const handleLeaveActivity = async () => {
      handlerMap.leave({ id }).then(() => {
        setRoute("my-activities");
      });
    };

    const handleUpdateActivityInfo = async ({ value }) => {
      return await handlerMap.update({ id, ...value });
    };

    const handleChangeRecurrence = async () => {};

    const handleUpdateFrequency = async ({ value }) => {
      return await handlerMap.updateFrequency({ id, frequency: value });
    };

    const handleUpdateNotificationOffset = async ({ value }) => {
      return await handlerMap.updateNotificationOffset({ id, notificationOffset: value });
    };

    //@@viewOn:render
    function renderNavigation() {
      return (
        <Tabs
          block
          type="line"
          colorScheme="primary"
          itemList={tabItemList}
          activeCode={activeTab}
          onChange={handleChangeTab}
          displayBottomLine={true}
        />
      );
    }

    function renderContent() {
      switch (activeTab) {
        case "info":
          return (
            <ActivityInformationView
              description={description}
              location={location}
              activityId={id}
              datetimeId={datetimeId}
              minParticipants={minParticipants}
              idealParticipants={idealParticipants}
              onReload={handleReload}
            />
          );
        case "members":
          return (
            <ActivityMembersView
              members={members}
              administrators={administrators}
              owner={owner}
              onRemoveMember={handleRemoveMember}
              onPromoteAdmin={handleAddAdministrator}
              onDemoteAdmin={handleRemoveAdministrator}
              onLeaveActivity={handleLeaveActivity}
            />
          );
        case "settings":
          return (
            <ActivitySettingsView
              {...data}
              onUpdateActivityInfo={handleUpdateActivityInfo}
              onChangeRecurrence={handleChangeRecurrence}
              onUpdateFrequency={handleUpdateFrequency}
              onUpdateNotificationOffset={handleUpdateNotificationOffset}
              onReload={handleReload}
            />
          );
        default:
          return <PlaceholderBox code="items" header={placeholderLsi.header} info={placeholderLsi.info} />;
      }
    }

    return (
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Header
            title={name}
            level={4}
            style={{ marginBottom: screenSize === "xs" ? "4px" : "8px", textAlign: "center" }}
          />
        </div>
        {renderNavigation()}
        {renderContent()}
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityDetail };
export default ActivityDetail;
//@@viewOff:exports
