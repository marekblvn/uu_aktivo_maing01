"use strict";

const InvitationAbl = require("../../abl/invitation-abl");

class InvitationController {
  create(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return InvitationAbl.create(awid, dtoIn, session, authorizationResult);
  }

  get(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return InvitationAbl.get(awid, dtoIn, session, authorizationResult);
  }
}

module.exports = new InvitationController();
