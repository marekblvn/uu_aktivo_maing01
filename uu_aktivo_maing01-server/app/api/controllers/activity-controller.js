"use strict";
const ActivityAbl = require("../../abl/activity-abl");

class ActivityController {
  create(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    return ActivityAbl.create(awid, dtoIn, session);
  }
  get(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return ActivityAbl.get(awid, dtoIn, session, authorizationResult);
  }
  list(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return ActivityAbl.list(awid, dtoIn, session, authorizationResult);
  }
  update(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return ActivityAbl.update(awid, dtoIn, session, authorizationResult);
  }
  updateFrequency(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return ActivityAbl.updateFrequency(awid, dtoIn, session, authorizationResult);
  }
  updateNotificationOffset(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return ActivityAbl.updateNotificationOffset(awid, dtoIn, session, authorizationResult);
  }
  addAdministrator(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return ActivityAbl.addAdministrator(awid, dtoIn, session, authorizationResult);
  }
  removeAdministrator(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return ActivityAbl.removeAdministrator(awid, dtoIn, session, authorizationResult);
  }
  transferOwnership(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return ActivityAbl.transferOwnership(awid, dtoIn, session, authorizationResult);
  }
}

module.exports = new ActivityController();
