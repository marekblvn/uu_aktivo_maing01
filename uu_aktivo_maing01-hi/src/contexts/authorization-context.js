//@@viewOn:imports
import { createComponent, Utils, useDataObject } from "uu5g05";
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
    // const { state: sessionState, identity } = useSession();
    // if (sessionState === "pending") return <SpaPending />;

    const {
      state: authorizationState,
      data,
      errorData,
    } = useDataObject({
      handlerMap: {
        load: Calls.getAuthorizedProfiles,
      },
    });

    if (authorizationState === "pending" || authorizationState === "pendingData") return <SpaPending />;

    const authorizedProfiles = data?.authorizedProfiles ?? [];
    const isAuthority = authorizedProfiles.includes(PROFILE_CODES.Authorities);
    const isExecutive = authorizedProfiles.includes(PROFILE_CODES.Executives);

    const authorization = {
      isAuthority,
      isExecutive,
    };

    if (errorData) return <Error error={errorData.error} title="Authorization error" />;
    return <AuthorizationContext.Provider value={authorization}>{children}</AuthorizationContext.Provider>;
  },
});
