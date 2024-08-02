"use strict";

const DatetimeAbl = require("../../abl/datetime-abl");

class DatetimeController {
  create(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return DatetimeAbl.create(awid, dtoIn, session, authorizationResult);
  }
  get(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return DatetimeAbl.get(awid, dtoIn, session, authorizationResult);
  }
  updateParticipation(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return DatetimeAbl.updateParticipation(awid, dtoIn, session, authorizationResult);
  }
  createNext() {}
  delete() {}
}

module.exports = new DatetimeController();
