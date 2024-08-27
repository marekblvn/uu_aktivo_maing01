//@@viewOn:imports
import { createComponent, useSession, Utils } from "uu5g05";
import Config from "./config/config.js";
//@@viewOff:imports

//@@viewOn:constants
export const [ActivityAuthorizationContext, useActivityAuthorization] = Utils.Context.create(null);
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: (props) => Config.Css.css({}),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

export const ActivityAuthorizationContextProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ActivityAuthorizationContext",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ children, activity }) {
    //@@viewOn:private
    const { identity } = useSession();

    const isAdministrator = activity.administrators.includes(identity.uuIdentity);
    const isOwner = activity.owner === identity.uuIdentity;

    const checkIfAdministrator = (uuIdentity) => activity.administrators.includes(uuIdentity);
    const checkIfOwner = (uuIdentity) => activity.owner === uuIdentity;

    const activityAuthorization = {
      isAdministrator,
      isOwner,
      checkIfAdministrator,
      checkIfOwner,
    };
    //@@viewOff:private

    //@@viewOn:render

    if (!activity) {
      return children;
    }

    return (
      <ActivityAuthorizationContext.Provider value={activityAuthorization}>
        {children}
      </ActivityAuthorizationContext.Provider>
    );
    //@@viewOff:render
  },
});
