"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/datetime-error");

const UnsupportedKeysWarning = (error) => `${error?.UC_CODE}unsupportedKeysWarning`;

const PROFILE_CODES = {
  Authorities: "Authorities",
  Executives: "Executives",
  StandardUsers: "StandardUsers",
};

class DatetimeAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "datetime-types.js"));
    this.datetimeDao = DaoFactory.getDao("datetime");
    this.datetimeDao.createSchema();
    this.activityDao = DaoFactory.getDao("activity");
  }

  async create(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("datetimeCreateDtoInType", dtoIn);
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

    if (activity.datetimeId !== null) {
      throw new Errors.Create.DatetimeAlreadyExists({ uuAppErrorMap }, { datetimeId: activity.datetimeId });
    }

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      const userUuIdentity = session.getIdentity().getUuIdentity();
      if (activity.owner !== userUuIdentity) {
        throw new Errors.Create.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    // CHECKING IF THE COMBINATION OF PROVIDED DATETIME AND THE NOTIFICATION OFFSET IS VALID
    // -- invalid combination would be such that the notification date and time calculates from the datetime would be in the past from now (in that case, the first notification would never be sent)
    let datetime = new Date(dtoIn.datetime);
    // calculate the date and time of the first notification
    let firstNotification = new Date(datetime);
    firstNotification.setDate(firstNotification.getDate() - dtoIn.notificationOffset.days);
    firstNotification.setHours(
      firstNotification.getHours() - dtoIn.notificationOffset.hours,
      firstNotification.getMinutes() - dtoIn.notificationOffset.minutes,
    );

    // if the first notification date and time is in the past from now, throw error
    if (firstNotification < new Date()) {
      throw new Errors.Create.InvalidDatetime({ uuAppErrorMap });
    }

    // CHECKING IF THE NOTIFICATION OFFSET IS AT LEAST AN HOUR
    if (firstNotification.getTime() >= datetime.getTime() - 59 * 60 * 1000) {
      throw new Errors.Create.InvalidNotificationOffset({ uuAppErrorMap });
    }

    if (dtoIn.recurrent === true) {
      if (!dtoIn.frequency || (dtoIn.frequency?.days === 0 && dtoIn.frequency?.months === 0)) {
        throw new Errors.Create.FrequencyIsRequired({ uuAppErrorMap });
      }

      // CHECKING IF THE COMBINATION OF FREQUENCY AND NOTIFICATION OFFSET IS VALID
      // -- invalid combination would be such that the notification date and time after calculation is before the previous datetime (the sum of notification offset days, hours, minutes must not be higher than the sum of frequency months and days)

      let nextDatetime = new Date(datetime);

      // calculate the date and time of when next datetime would be from the passed datetime
      nextDatetime.setMonth(nextDatetime.getMonth() + dtoIn.frequency.months);
      nextDatetime.setDate(nextDatetime.getDate() + dtoIn.frequency.days);
      // prepare the next notification
      let nextNotification = new Date(nextDatetime);
      // calculate the date and time of when the next notification would be from the next datetime
      nextNotification.setDate(nextNotification.getDate() - dtoIn.notificationOffset.days);
      nextNotification.setHours(
        nextNotification.getHours() - dtoIn.notificationOffset.hours,
        nextNotification.getMinutes() - dtoIn.notificationOffset.minutes,
      );

      // calculate if the nextNotification time is more than an hour after the first datetime
      if (nextNotification.getTime() - datetime.getTime() <= 1000 * 60 * 60) {
        throw new Errors.Create.InvalidFrequencyAndNotificationOffset({ uuAppErrorMap });
      }
    }

    const datetimeCreateObject = {
      awid,
      activityId: dtoIn.activityId,
      undecided: activity.members,
      confirmed: [],
      denied: [],
      datetime: dtoIn.datetime,
      notification: firstNotification,
    };
    let dtoOut;
    try {
      dtoOut = await this.datetimeDao.create(datetimeCreateObject);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Create.DatetimeDaoCreateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    const activityUpdateObject = {
      awid,
      id: dtoIn.activityId,
      datetimeId: dtoOut.id,
      notificationOffset: dtoIn.notificationOffset,
      recurrent: dtoIn.recurrent,
    };
    if (dtoIn.frequency) {
      activityUpdateObject.frequency = dtoIn.frequency;
    }

    try {
      await this.activityDao.update(activityUpdateObject);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Create.ActivityDaoUpdateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new DatetimeAbl();
