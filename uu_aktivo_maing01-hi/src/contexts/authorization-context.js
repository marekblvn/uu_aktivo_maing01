//@@viewOn:imports
import { createComponent, Utils, useDataObject, useSession } from "uu5g05";
import { Error, SpaPending } from "uu_plus4u5g02-app";
import Config from "./config/config.js";
import Calls from "../calls.js";
//@@viewOff:imports

export const [AuthorizationContext, useAuthorization] = Utils.Context.create(null);

const PROFILE_CODES = {
  Authorities: "Authorities",
  Executives: "Executives",
  StandardUsers: "StandardUsers",
};

export const AuthorizationContextProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AuthorizationContextProvider",
  //@@viewOff:statics

  render({ children }) {
    const { state: sessionState } = useSession();

    const {
      state: authorizationState,
      data,
      errorData,
    } = useDataObject(
      {
        skipInitialLoad: sessionState === "pending" || sessionState === "pendingNoData",
        handlerMap: {
          load: Calls.getAuthorizedProfiles,
        },
      },
      [sessionState],
    );

    const authorizedProfiles = data?.authorizedProfiles ?? [];
    const isAuthority = authorizedProfiles.includes(PROFILE_CODES.Authorities);
    const isExecutive = authorizedProfiles.includes(PROFILE_CODES.Executives);

    const authorization = {
      isAuthority,
      isExecutive,
    };

    return <AuthorizationContext.Provider value={authorization}>{children}</AuthorizationContext.Provider>;
  },
});
