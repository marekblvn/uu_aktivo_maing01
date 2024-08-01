"use strict";

const AttendanceAbl = require("../../abl/attendance-abl");

class AttendanceController {
  create(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    return AttendanceAbl.create(awid, dtoIn);
  }
}

module.exports = new AttendanceController();
