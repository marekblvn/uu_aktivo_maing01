"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/activity-error");

const UnsupportedKeysWarning = (error) => `${error?.UC_CODE}unsupportedKeys`;

class ActivityAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "activity-types.js"));
    this.activityDao = DaoFactory.getDao("activity");
    this.activityDao.createSchema();
  }
  async create(awid, dtoIn, session) {
    let validationResult = this.validator.validate("activityCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Create),
      Errors.Create.InvalidDtoIn,
    );
    dtoIn.awid = awid;
    if (!dtoIn.description) {
      dtoIn.description = "";
    }
    if (!dtoIn.location) {
      dtoIn.location = "";
    }
    if (dtoIn.minParticipants === undefined) {
      dtoIn.minParticipants = 0;
    }
    if (dtoIn.idealParticipants === undefined) {
      dtoIn.idealParticipants = 0;
    }
    const userIdentity = session.getIdentity().getUuIdentity();
    dtoIn.owner = userIdentity;
    dtoIn.administrators = [];
    dtoIn.members = [userIdentity];
    dtoIn.recurrent = false;
    dtoIn.datetimeId = null;
    dtoIn.frequency = {};
    dtoIn.notificationOffset = {};
    let dtoOut;
    try {
      dtoOut = await this.activityDao.create(dtoIn);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Create.ActivityDaoCreateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new ActivityAbl();
