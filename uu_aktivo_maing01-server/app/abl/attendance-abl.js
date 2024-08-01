"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/attendance-error");

const UnsupportedKeysWarning = (error) => `${error?.UC_CODE}unsupportedKeys`;

const PROFILE_CODES = {
  Authorities: "Authorities",
  Executives: "Executives",
  StandardUsers: "StandardUsers",
};

class AttendanceAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "attendance-types.js"));
    this.attendanceDao = DaoFactory.getDao("attendance");
    this.attendanceDao.createSchema();
    this.activityDao = DaoFactory.getDao("activity");
    this.datetimeDao = DaoFactory.getDao("datetime");
  }

  async create(awid, dtoIn) {
    let validationResult = this.validator.validate("attendanceCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Create),
      Errors.Create.InvalidDtoIn,
    );

    let datetime;
    try {
      datetime = await this.datetimeDao.get(awid, dtoIn.datetimeId);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Create.DatetimeDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!datetime) {
      throw new Errors.Create.DatetimeDoesNotExist({ uuAppErrorMap }, { datetimeId: dtoIn.datetimeId });
    }

    if (datetime.datetime >= new Date()) {
      throw new Errors.Create.DatetimeStillActive({ uuAppErrorMap });
    }

    let activity;
    try {
      activity = await this.activityDao.get(awid, datetime.activityId);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Create.ActivityDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!activity) {
      throw new Errors.Create.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: datetime.activityId });
    }

    const attendanceObject = {
      awid,
      ...datetime,
      notification: undefined,
    };

    let dtoOut;
    try {
      dtoOut = await this.attendanceDao.create(attendanceObject);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Create.AttendanceDaoCreateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new AttendanceAbl();
