"use strict";
const AktivoMainUseCaseError = require("./aktivo-main-use-case-error.js");

class CallScriptEngineFailed extends AktivoMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("callScriptEngineFailed", "Call scriptEngine failed.", paramMap, cause);
  }
}

module.exports = {
  CallScriptEngineFailed,
};
