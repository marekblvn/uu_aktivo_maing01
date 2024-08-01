"use strict";

const AttendanceAbl = require("../../abl/attendance-abl");

class AttendanceController {
  create(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    return AttendanceAbl.create(awid, dtoIn);
  }
  list(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return AttendanceAbl.list(awid, dtoIn, session, authorizationResult);
  }

  delete(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return AttendanceAbl.delete(awid, dtoIn, session, authorizationResult);
  }
}

module.exports = new AttendanceController();
