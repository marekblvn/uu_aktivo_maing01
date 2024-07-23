"use strict";
const AktivoMainUseCaseError = require("./aktivo-main-use-case-error.js");

class ConfigurationLoadFailed extends AktivoMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("configurationLoadFailed", "Failed to obtain configuration needed to continue.", paramMap, cause);
  }
}

class UuAppMetaModelDoesNotExist extends AktivoMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("uuAppMetaModelDoesNotExist", "Metamodel does not exist.", paramMap, cause);
  }
}

module.exports = {
  ConfigurationLoadFailed,
  UuAppMetaModelDoesNotExist,
};
