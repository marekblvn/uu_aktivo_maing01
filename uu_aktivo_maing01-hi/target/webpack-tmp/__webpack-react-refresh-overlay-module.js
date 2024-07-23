(function () {
  const api = require("C:\\Users\\marek\\Development\\uu_aktivo_maing01\\uu_aktivo_maing01-hi\\node_modules\\@pmmmwh\\react-refresh-webpack-plugin\\overlay\\index.js");
  module.exports = {
    ...api,
    // in our case this method gets called only if hot module accept failed (due to runtime error, i.e. there was an exception
    // when executing new file, e.g. top-level error; but not compilation error) - see also react-refresh-overlay-entry.ejs
    // https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/docs/API.md#module
    handleRuntimeError: function (error) {
      // if page uses several development libraries at once and developer changes source code in one of them
      // (which causes page reload), then do not show the overlay while the page is being reloaded
      if (/Aborted because .*? is not accepted/.test(error + "")) return;
      
      console.error(error);

      // NOTE If developer adds external dependency (or webpack recovers from compilation error in a file which is
      // the only one that uses certain external dependency) then the *.hot-update.js file contains
      // reference to the external module in the form of:
      //   module.exports = __WEBPACK_EXTERNAL_MODULE_uu_plus4u5g02_elements__;
      // but the variable __WEBPACK_EXTERNAL_MODULE_uu_plus4u5g02_elements__ is not defined anywhere (resp. it can be a local variable
      // in main chunk only in case that we're recovering from compilation error, but anyway it is not visible from *.hot-update.js file)
      //   => do reload in such case as there is no easy way to load & wait for the external dependency
      if (/ReferenceError.*__WEBPACK_EXTERNAL_MODULE/.test(error)) {
        window.reload();
        return;
      }

      return api.handleRuntimeError.call(this, error);
    },
  };
})();
