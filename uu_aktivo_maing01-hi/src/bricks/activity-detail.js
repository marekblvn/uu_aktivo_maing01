//@@viewOn:imports
import { createVisualComponent, Lsi, useDevice, useScreenSize, useSession, useState } from "uu5g05";
import Config from "./config/config.js";
import { Header, Tabs } from "uu5g05-elements";
import ActivityNavigationBar from "./activity-navigation-bar.js";
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
    data: {
      name: "Activity name",
      description: "Activity description",
      location: "Activity location",
      owner: "3857-7491-1",
    },
  },
  //@@viewOff:defaultProps

  render({ data }) {
    //@@viewOn:private
    const { name, location, description, owner } = data;
    const [screenSize] = useScreenSize();
    const { identity } = useSession();
    const { isMobileOrTablet } = useDevice();
    const [activeTab, setActiveTab] = useState("info");

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
    if (identity.uuIdentity === owner) {
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

    //@@viewOn:render
    function renderNavigation() {
      if (isMobileOrTablet && screenSize === "xs") {
        return <ActivityNavigationBar itemList={tabItemList} activeCode={activeTab} onChange={handleChangeTab} />;
      }
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

    return (
      <>
        <Header title={name} level={4} style={{ marginBottom: "24px" }} />
        {renderNavigation()}
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ActivityDetail };
export default ActivityDetail;
//@@viewOff:exports
