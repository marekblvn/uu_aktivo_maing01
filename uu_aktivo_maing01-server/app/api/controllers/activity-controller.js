"use strict";
const ActivityAbl = require("../../abl/activity-abl");

class ActivityController {
  create(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    return ActivityAbl.create(awid, dtoIn, session);
  }
}

module.exports = new ActivityController();
