"use strict";

const AttendanceAbl = require("../../abl/attendance-abl");

class AttendanceController {
  create(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return AttendanceAbl.create(awid, dtoIn, authorizationResult);
  }
  get(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return AttendanceAbl.get(awid, dtoIn, session, authorizationResult);
  }
  list(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return AttendanceAbl.list(awid, dtoIn, session, authorizationResult);
  }
  getStatistics(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return AttendanceAbl.getStatistics(awid, dtoIn, session, authorizationResult);
  }
  delete(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return AttendanceAbl.delete(awid, dtoIn, session, authorizationResult);
  }

  deleteBulk(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return AttendanceAbl.deleteBulk(awid, dtoIn, session, authorizationResult);
  }
}

module.exports = new AttendanceController();
