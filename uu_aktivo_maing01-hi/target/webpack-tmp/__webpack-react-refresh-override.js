// NOTE "react-refresh/runtime" must be in single copy in the page and it must also be run before
// react gets loaded => store & re-use it in a global variable, so that html demo with multiple libraries loaded works too.
// https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/334#issuecomment-841883234
// https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/docs/TROUBLESHOOTING.md#externalising-react
if (window.__uuAppDevKit_ReactRefreshOverride) {
  const fullIdPrefix = "./uuAppDevKit/" + process.env.NAME + "_" + process.env.VERSION + "/";
  const toFullId = (id) => (/\/uuAppDevKit\//.test(id) ? id : fullIdPrefix + id);
  module.exports = {
    ...window.__uuAppDevKit_ReactRefreshOverride,
    register: (type, id, ...args) => window.__uuAppDevKit_ReactRefreshOverride.register(type, toFullId(id)),
    getFamilyByID: (id) => window.__uuAppDevKit_ReactRefreshOverride.getFamilyByID(toFullId(id)),
  };
} else {
  module.exports = window.__uuAppDevKit_ReactRefreshOverride = (() => {
    // check whether react got already loaded
    // NOTE Disabling react hot loading will result in doing full page reload instead of partial re-renders.
    // NOTE As a precaution, we'll disable it also if we're not being executed as <script src="react-refresh-runtime.js"/>
    // (i.e. not from our demo / uuApp HTML file, or not using our dev server).
    const disabled =
      (typeof Uu5Loader !== "undefined" && Uu5Loader.get("react") != null) ||
      (typeof SystemJS !== "undefined" && SystemJS.get(SystemJS.normalizeSync("react")) != null) ||
      process.env.NAME !== "react-refresh-runtime";
    const RefreshRuntime = require("C:\\Users\\marek\\Development\\uu_aktivo_maing01\\uu_aktivo_maing01-hi\\node_modules\\react-refresh\\runtime.js");
    if (RefreshRuntime?.isLikelyComponentType) {
      let origFn = RefreshRuntime.isLikelyComponentType;
      RefreshRuntime.isLikelyComponentType = function (type) {
        let result = origFn.apply(this, arguments);
        // NOTE Original fn uses `type.name || type.displayName` to check whether it's PascalCase-d name.
        // Problem is that uu5 components in development mode are auto-wrapped into a function with name "render"
        // (see uu5g05's createVisualComponent()) so fn will return false. So we'll simply check uu5's specific flag instead.
        // NOTE If we didn't do this, hot module loading would simply always perform full page reload
        // whenever source code got changed.
        if (!result && type?.uu5ComponentType) result = true;
        return result;
      };
    }
    let result = RefreshRuntime;
    if (disabled && RefreshRuntime) {
      // hot loading won't work (we might be using production uuApp and we overrode library to locally-developed one)
      // => disable react hot loading (page will be fully refreshed whenever source code is changed)
      // TODO Do somehow better.
      let keys = Object.getOwnPropertyNames(RefreshRuntime);
      result = {};
      for (let key of keys) {
        result[key] = typeof RefreshRuntime[key] === "function" ? () => {} : RefreshRuntime[key];
      }
    }
    return result;
  })();
}
