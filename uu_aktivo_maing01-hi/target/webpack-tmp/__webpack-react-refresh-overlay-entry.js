(function () {
  // NOTE ReactRefresh overlay also registers for "error" and "unhandledrejection" window events and calls its
  // handleRuntimeError() API method - we want to be able to distinguish whether it's this case or whether the handler
  // got called as an error handler for hot module acceptance error by webpack (e.g. JS error got thrown in root scope of
  // edited file). In case of acceptance error we want to show overlay / reload page but in case of "error"/"unhandledrejection"
  // events we'll let those happen without handling them (it can be e.g. failed backend command and developer shouldn't be blocked
  // from UI in such case).
  // => skip registration of "error" / "unhandledrejection" handler when initializing ReactRefresh overlay entry
  //    (see node_modules/@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry.js)
  // NOTE Also note that compilation errors are handled by different method (showCompileError, clearCompileErrors).
  // https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/docs/API.md#module

  function disableHandleRuntimeErrorRegistration(fn) {
    let collectedHandlerMap = {};
    let origAddEventListener = window.addEventListener;
    window.addEventListener = function (type, handler) {
      if (type === "error" || type === "unhandledrejection") {
        collectedHandlerMap[type] ??= 0;
        collectedHandlerMap[type]++;
        return;
      }
      return origAddEventListener.apply(this, arguments);
    };
    try {
      fn();
    } finally {
      window.addEventListener = origAddEventListener;
      // expect 1 of each event handlers or none of them (initialization is 1 per whole page, but entry can be present multiple times)
      if (!(Object.keys(collectedHandlerMap).length === 0 || (Object.keys(collectedHandlerMap).length === 2 && collectedHandlerMap["error"] === 1 && collectedHandlerMap["unhandledrejection"] === 1))) {
        console.warn("Hot module reload might not work correctly - unexpected initialization of ReactRefresh overlay entry happenned. Report this as a uuAppDevKit issue please.");
      }
    }
  }

  disableHandleRuntimeErrorRegistration(() => {
    require("C:\\Users\\marek\\Development\\uu_aktivo_maing01\\uu_aktivo_maing01-hi\\node_modules\\@pmmmwh\\react-refresh-webpack-plugin\\client\\ErrorOverlayEntry.js");
  });
})();
