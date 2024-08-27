"use strict";
const AktivoMainAbl = require("../../abl/aktivo-main-abl.js");

class AktivoMainController {
  init(ucEnv) {
    return AktivoMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return AktivoMainAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }

  loadBasicData(ucEnv) {
    return AktivoMainAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }

  getAuthorizedProfiles(ucEnv) {
    return AktivoMainAbl.getAuthorizedProfiles(ucEnv.getAuthorizationResult());
  }
}

module.exports = new AktivoMainController();
