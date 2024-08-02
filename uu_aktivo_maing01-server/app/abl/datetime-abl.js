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

  async get(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("datetimeGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Get),
      Errors.Get.InvalidDtoIn,
    );

    let datetime;
    try {
      datetime = await this.datetimeDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Get.DatetimeDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!datetime) {
      throw new Errors.Get.DatetimeDoesNotExist({ uuAppErrorMap }, { datetimeId: dtoIn.id });
    }

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      let activity;

      try {
        activity = await this.activityDao.get(awid, datetime.activityId);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Get.ActivityDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!activity) {
        throw new Errors.Get.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: datetime.activityId });
      }

      const userUuIdentity = session.getIdentity().getUuIdentity();
      if (!activity.members.includes(userUuIdentity)) {
        throw new Errors.Get.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    let dtoOut = { ...datetime };
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async updateParticipation(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("datetimeUpdateParticipationDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.UpdateParticipation),
      Errors.UpdateParticipation.InvalidDtoIn,
    );

    let datetime;
    try {
      datetime = await this.datetimeDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.UpdateParticipation.DatetimeDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!datetime) {
      throw new Errors.UpdateParticipation.DatetimeDoesNotExist({ uuAppErrorMap }, { datetimeId: dtoIn.id });
    }

    const members = [...datetime.undecided, ...datetime.confirmed, ...datetime.denied];
    const userUuIdentity = session.getIdentity().getUuIdentity();
    if (!members.includes(userUuIdentity)) {
      throw new Errors.UpdateParticipation.UserNotAuthorized({ uuAppErrorMap });
    }

    const currentTimeMs = new Date().getTime();
    const datetimeTimeMs = new Date(datetime.datetime).getTime();
    const timeDiffMs = currentTimeMs - datetimeTimeMs;
    if (timeDiffMs >= 30_000) {
      throw new Errors.UpdateParticipation.DatetimeHasPassed({ uuAppErrorMap });
    }

    const filteredUndecided = datetime.undecided.filter((v) => v !== userUuIdentity);
    const filteredDenied = datetime.denied.filter((v) => v !== userUuIdentity);
    const filteredConfirmed = datetime.confirmed.filter((v) => v !== userUuIdentity);

    let dtoOut;
    switch (dtoIn.type) {
      case "confirmed":
        if (datetime.confirmed.includes(userUuIdentity)) {
          dtoOut = datetime;
          break;
        }
        filteredConfirmed.push(userUuIdentity);
        break;
      case "denied":
        if (datetime.denied.includes(userUuIdentity)) {
          dtoOut = datetime;
          break;
        }
        filteredDenied.push(userUuIdentity);
        break;
      case "undecided":
        if (datetime.undecided.includes(userUuIdentity)) {
          dtoOut = datetime;
          break;
        }
        filteredUndecided.push(userUuIdentity);
        break;
    }

    if (!dtoOut) {
      console.log("no dtoout");
      const datetimeUpdateObject = {
        id: dtoIn.id,
        awid,
        undecided: filteredUndecided,
        confirmed: filteredConfirmed,
        denied: filteredDenied,
      };
      try {
        dtoOut = await this.datetimeDao.update(datetimeUpdateObject);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.UpdateParticipation.DatetimeDaoUpdateFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }
    }

    dtoOut.uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new DatetimeAbl();
