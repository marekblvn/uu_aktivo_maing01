//@@viewOn:imports
import {
  createVisualComponent,
  Lsi,
  useEffect,
  useRoute,
  useRouteLeave,
  useScreenSize,
  useSlide,
  useState,
} from "uu5g05";
import { Grid, Tabs, Text } from "uu5g05-elements";
import Config from "./config/config.js";
import { useAuthorization } from "../contexts/authorization-context.js";
import { useActivityAuthorization } from "../contexts/activity-authorization-context.js";
import ActivityInformationView from "./activity-information-view.js";
import ActivityMembersView from "./activity-members-view.js";
import ActivitySettingsView from "./activity-settings-view.js";
import ActivityAttendanceView from "./activity-attendance-view.js";
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

  render({ data, handlerMap, tab }) {
    //@@viewOn:private
    const { id, name } = data;

    const [, setRoute] = useRoute();
    const { nextRoute, allow } = useRouteLeave();
    const { isAuthority, isExecutive } = useAuthorization();
    const { isAdministrator, isOwner } = useActivityAuthorization();

    const [screenSize] = useScreenSize();

    const [activeTab, setActiveTab] = useState(tab);
    const { ref, style } = useSlide({
      onEnd(e) {
        const { direction, pointerType } = e.data;
        if (pointerType !== "mouse") {
          if (direction.right) setActiveTab(tabDirections[activeTab].left);
          else if (direction.left) setActiveTab(tabDirections[activeTab].right);
        }
      },
    });

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
    }, [nextRoute, allow]);

    const canAccessSettings = isAuthority || isExecutive || isOwner || isAdministrator;

    if (!canAccessSettings && tab === "settings") {
      setRoute("activity", { id, tab: "information" }, { replace: true });
    }

    const tabDirections = {
      information: {
        left: "information",
        right: "members",
      },
      members: {
        left: "information",
        right: "attendance",
      },
      attendance: {
        left: "members",
        right: canAccessSettings ? "settings" : "attendance",
      },
      settings: {
        left: "attendance",
        right: "settings",
      },
    };

    const tabItemList = [
      {
        label:
          ["xs", "s"].includes(screenSize) && activeTab !== "information" ? undefined : (
            <Text category="interface" segment="highlight" type="common">
              <Lsi lsi={{ en: "Information", cs: "Informace" }} />
            </Text>
          ),
        icon: activeTab === "information" ? "mdi-information" : "mdi-information-outline",
        code: "information",
      },
      {
        label:
          ["xs", "s"].includes(screenSize) && activeTab !== "members" ? undefined : (
            <Text category="interface" segment="highlight" type="common">
              <Lsi lsi={{ en: "Members", cs: "Členové" }} />
            </Text>
          ),
        icon: activeTab === "members" ? "mdi-account-multiple" : "mdi-account-multiple-outline",
        code: "members",
      },
      {
        label:
          ["xs", "s"].includes(screenSize) && activeTab !== "attendance" ? undefined : (
            <Text category="interface" segment="highlight" type="common">
              <Lsi lsi={{ en: "Attendance", cs: "Docházka" }} />
            </Text>
          ),
        icon: activeTab === "attendance" ? "mdi-chart-box" : "mdi-chart-box-outline",
        code: "attendance",
      },
    ];
    if (canAccessSettings) {
      tabItemList.push({
        label:
          ["xs", "s"].includes(screenSize) && activeTab !== "settings" ? undefined : (
            <Text category="interface" segment="highlight" type="common">
              <Lsi lsi={{ en: "Settings", cs: "Nastavení" }} />
            </Text>
          ),
        icon: activeTab === "settings" ? "mdi-cog" : "mdi-cog-outline",
        code: "settings",
      });
    }
    //@@viewOff:private

    function handleChangeTab({ activeCode }) {
      setRoute("activity", { id: id, tab: activeCode }, { replace: true });
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

    const handleUpdateActivity = async ({ value }) => {
      return await handlerMap.update({ id, ...value });
    };

    const handleTransferOwnership = async ({ value }) => {
      return await handlerMap.transferOwnership({ id, ...value });
    };

    const handleDeleteActivity = async (id) => {
      return await handlerMap.delete({ id });
    };

    const handleChangeRecurrence = async () => {};

    const handleUpdateFrequency = async ({ value }) => {
      return await handlerMap.updateFrequency({ id, ...value });
    };

    const handleUpdateNotificationOffset = async ({ value }) => {
      return await handlerMap.updateNotificationOffset({ id, notificationOffset: value });
    };

    //@@viewOn:render
    function renderNavigation() {
      return (
        <Tabs
          justified
          type="card-inner"
          colorScheme="primary"
          itemList={tabItemList}
          activeCode={activeTab}
          onChange={handleChangeTab}
          displayBottomLine={true}
          size="s"
        />
      );
    }

    function renderContent() {
      switch (activeTab) {
        case "members":
          return (
            <ActivityMembersView
              {...data}
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
              onUpdateActivity={handleUpdateActivity}
              onChangeRecurrence={handleChangeRecurrence}
              onUpdateFrequency={handleUpdateFrequency}
              onUpdateNotificationOffset={handleUpdateNotificationOffset}
              onReload={handleReload}
              onTransferOwnership={handleTransferOwnership}
              onDeleteActivity={handleDeleteActivity}
            />
          );
        case "attendance":
          return <ActivityAttendanceView activityId={id} />;
        case "info":
        default:
          return <ActivityInformationView {...data} onReload={handleReload} />;
      }
    }

    const { userSelect, ...restStyles } = style;

    return (
      <Grid templateRows={{ xs: "auto auto" }} rowGap="8px" elementRef={ref} style={restStyles}>
        <Grid justifyContent="center">
          <Text
            category="story"
            segment="heading"
            type={["xs", "s"].includes(screenSize) ? "h5" : "h4"}
            style={{ marginBottom: "12px" }}
          >
            {name}
          </Text>
        </Grid>
        <Grid rowGap={0}>
          {renderNavigation()}
          {renderContent()}
        </Grid>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityDetail };
export default ActivityDetail;
//@@viewOff:exports
