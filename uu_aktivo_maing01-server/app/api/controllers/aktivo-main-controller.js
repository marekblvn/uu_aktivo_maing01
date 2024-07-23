"use strict";
const InitAbl = require("../../abl/aktivo-main/init-abl.js");
const InitRollbackAbl = require("../../abl/aktivo-main/init-rollback-abl.js");
const LoadAbl = require("../../abl/aktivo-main/load-abl.js");
const CommenceAbl = require("../../abl/aktivo-main/commence-abl.js");

class AktivoMainController {
  init(ucEnv) {
    return InitAbl.init(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  _initFinalize(ucEnv) {
    return InitAbl._initFinalize(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  _initFinalizeRollback(ucEnv) {
    return InitRollbackAbl._initFinalizeRollback(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  load(ucEnv) {
    return LoadAbl.load(ucEnv.getUri(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

  loadBasicData(ucEnv) {
    return LoadAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }

  commence(ucEnv) {
    return CommenceAbl.commence(ucEnv.getUri(), ucEnv.getDtoIn());
  }
}

module.exports = new AktivoMainController();
