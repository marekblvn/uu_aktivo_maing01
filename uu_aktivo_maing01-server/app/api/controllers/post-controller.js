"use strict";
const PostAbl = require("../../abl/post-abl");

class PostController {
  create(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return PostAbl.create(awid, dtoIn, session, authorizationResult);
  }

  get(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    return PostAbl.get(awid, dtoIn);
  }

  list(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return PostAbl.list(awid, dtoIn, session, authorizationResult);
  }

  update(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return PostAbl.update(awid, dtoIn, session, authorizationResult);
  }

  delete(ucEnv) {
    const awid = ucEnv.getUri().getAwid();
    const dtoIn = ucEnv.getDtoIn();
    const session = ucEnv.getSession();
    const authorizationResult = ucEnv.getAuthorizationResult();
    return PostAbl.delete(awid, dtoIn, session, authorizationResult);
  }
}

module.exports = new PostController();
