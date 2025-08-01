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
  list(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return DatetimeAbl.list(awid, dtoIn, authorizationResult);
  }
  updateParticipation(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return DatetimeAbl.updateParticipation(awid, dtoIn, session, authorizationResult);
  }
  createNext(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return DatetimeAbl.createNext(awid, dtoIn, session, authorizationResult);
  }
  delete(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return DatetimeAbl.delete(awid, dtoIn, session, authorizationResult);
  }
}

module.exports = new DatetimeController();
