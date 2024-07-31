"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/post-error");

const UnsupportedKeysWarning = (error) => `${error?.UC_CODE}unsupportedKeys`;

const PROFILE_CODES = {
  Authorities: "Authorities",
  Executives: "Executives",
  StandardUsers: "StandardUsers",
};

class PostAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "post-types.js"));
    this.postDao = DaoFactory.getDao("post");
    this.postDao.createSchema();
    this.activityDao = DaoFactory.getDao("activity");
  }

  async create(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("postCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Create),
      Errors.Create.InvalidDtoIn,
    );

    let activity;
    try {
      activity = await this.activityDao.get(awid, dtoIn.activityId);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Create.ActivityDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!activity) {
      throw new Errors.Create.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.activityId });
    }

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const userUuIdentity = session.getIdentity().getUuIdentity();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      if (!activity.members.includes(userUuIdentity)) {
        throw new Errors.Create.UserNotMember({ uuAppErrorMap });
      }
      if (dtoIn.type === "important" && !activity.administrators.includes(userUuIdentity)) {
        throw new Errors.Create.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    if (!dtoIn.type) {
      dtoIn.type = "normal";
    }
    dtoIn.awid = awid;
    dtoIn.uuIdentity = userUuIdentity;
    dtoIn.uuIdentityName = session.getIdentity().getName();

    let dtoOut;
    try {
      dtoOut = await this.postDao.create(dtoIn);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Create.PostDaoCreateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new PostAbl();
