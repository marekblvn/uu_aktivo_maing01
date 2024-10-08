"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/datetime-error");
const InstanceChecker = require("../api/components/instance-checker");

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
    this.attendanceDao = DaoFactory.getDao("attendance");
  }

  async create(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("datetimeCreateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Create),
      Errors.Create.InvalidDtoIn,
    );

    await InstanceChecker.ensureInstanceAndState(awid, Errors.Create, uuAppErrorMap, authorizationResult, {
      Authorities: ["active", "restricted"],
      Executives: ["active", "restricted"],
      StandardUsers: ["active"],
    });

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

    const datetimeAsDate = new Date(dtoIn.datetime);
    const now = new Date();
    let diff = datetimeAsDate - now;

    // datetime must NOT be sooner than 12 hours from now
    if (diff / 1_000 / 3_600 < 12) {
      throw new Errors.Create.InvalidDatetime({ uuAppErrorMap });
    }

    const notificationOffsetInHours =
      dtoIn.notificationOffset.days * 24 + dtoIn.notificationOffset.hours + dtoIn.notificationOffset.minutes / 60;

    // notificationOffset combined must be AT LEAST an hour
    if (notificationOffsetInHours < 1) {
      throw new Errors.Create.InvalidNotificationOffset({ uuAppErrorMap });
    }

    const notificationDate = new Date(datetimeAsDate);
    notificationDate.setDate(notificationDate.getDate() - dtoIn.notificationOffset.days);
    notificationDate.setHours(
      notificationDate.getHours() - dtoIn.notificationOffset.hours,
      notificationDate.getMinutes() - dtoIn.notificationOffset.minutes,
    );
    // notificationDate --> date of the first notification

    // date of notification must NOT be in the past from now
    if (notificationDate < now) {
      throw new Errors.Create.NotificationDateIsInPast({ uuAppErrorMap });
    }

    if (dtoIn.recurrent === true) {
      if (!dtoIn.frequency || (dtoIn.frequency.months === 0 && dtoIn.frequency.days === 0)) {
        throw new Errors.Create.FrequencyIsRequired({ uuAppErrorMap });
      }
      const nextDatetime = new Date(datetimeAsDate);
      nextDatetime.setMonth(nextDatetime.getMonth() + dtoIn.frequency.months);
      nextDatetime.setDate(nextDatetime.getDate() + dtoIn.frequency.days);
      const nextNotificationDate = new Date(nextDatetime);
      nextNotificationDate.setDate(nextNotificationDate.getDate() - dtoIn.notificationOffset.days);
      nextNotificationDate.setHours(
        nextNotificationDate.getHours() - dtoIn.notificationOffset.hours,
        nextNotificationDate.getMinutes() - dtoIn.notificationOffset.minutes,
      );

      // next notification must NOT be sent BEFORE the current datetime, only after the next datetime is calculated, which happens then the current datetime passes
      if (nextNotificationDate <= datetimeAsDate) {
        throw new Errors.Create.InvalidFrequencyAndNotificationOffset({ uuAppErrorMap });
      }
    }

    const datetimeCreateObject = {
      awid,
      activityId: activity.id,
      undecided: activity.members.map((member) => member.uuIdentity),
      confirmed: [],
      denied: [],
      datetime: datetimeAsDate,
      notification: notificationDate,
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

    await InstanceChecker.ensureInstanceAndState(awid, Errors.Get, uuAppErrorMap, authorizationResult, {
      Authorities: ["active", "restricted", "readOnly"],
      Executives: ["active", "restricted"],
      StandardUsers: ["active"],
    });

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
      if (!activity.members.some((member) => member.uuIdentity === userUuIdentity)) {
        throw new Errors.Get.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    let dtoOut = { ...datetime };
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async list(awid, dtoIn, authorizationResult) {
    let validationResult = this.validator.validate("datetimeListDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.List),
      Errors.List.InvalidDtoIn,
    );

    await InstanceChecker.ensureInstanceAndState(awid, Errors.List, uuAppErrorMap, authorizationResult, {
      Authorities: ["active", "restricted", "readOnly"],
      Executives: ["active", "restricted"],
    });

    const filters = {};
    if (dtoIn.filters) {
      const { datetime, notification } = dtoIn.filters;

      if (datetime && datetime.filter((item) => item != null).length > 0) {
        filters.datetime = {};
        if (datetime[0]) {
          filters.datetime.$gt = new Date(datetime[0]);
        }
        if (datetime[1]) {
          filters.datetime.$lte = new Date(datetime[1]);
        }
      }

      if (notification && notification.filter((item) => item != null).length > 0) {
        filters.notification = {};
        if (notification[0]) {
          filters.notification.$gt = new Date(notification[0]);
        }
        if (notification[1]) {
          filters.notification.$lte = new Date(notification[1]);
        }
      }
    }

    const sort = {};
    if (dtoIn.sort) {
      const { datetime, notification } = dtoIn.sort;
      if (datetime) {
        sort.datetime = datetime;
      }

      if (notification) {
        sort.notification = notification;
      }
    }

    const pageIndex = dtoIn.pageInfo?.pageIndex || 0;
    const pageSize = dtoIn.pageInfo?.pageSize || 10;

    let dtoOut;
    if (dtoIn.withActivity === true) {
      try {
        [dtoOut] = await this.datetimeDao.listWithActivity(awid, filters, { pageIndex, pageSize }, sort);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.List.DatetimeDaoListWithActivityFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }
    } else {
      try {
        dtoOut = await this.datetimeDao.list(awid, filters, { pageIndex, pageSize }, sort);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.List.DatetimeDaoListFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }
    }

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

    await InstanceChecker.ensureInstanceAndState(awid, Errors.UpdateParticipation, uuAppErrorMap, authorizationResult, {
      Authorities: ["active", "restricted"],
      Executives: ["active", "restricted"],
      StandardUsers: ["active"],
    });

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

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async delete(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("datetimeDeleteDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Delete),
      Errors.Delete.InvalidDtoIn,
    );

    await InstanceChecker.ensureInstanceAndState(awid, Errors.Delete, uuAppErrorMap, authorizationResult, {
      Authorities: ["active", "restricted"],
      Executives: ["active", "restricted"],
      StandardUsers: ["active"],
    });

    let datetime;
    try {
      datetime = await this.datetimeDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Delete.DatetimeDaoDeleteFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!datetime) {
      throw new Errors.Delete.DatetimeDoesNotExist({ uuAppErrorMap }, { datetimeId: dtoIn.id });
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
          throw new Errors.Delete.ActivityDaoGetFailed({ uuAppErrorMap }, error);
        }
      }
      if (!activity) {
        throw new Errors.Delete.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: datetime.activityId });
      }

      const userUuIdentity = session.getIdentity().getUuIdentity();

      if (activity.owner !== userUuIdentity) {
        throw new Errors.Delete.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    try {
      await this.attendanceDao.deleteByActivityId(awid, datetime.activityId);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Delete.AttendanceDaoDeleteByActivityIdFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    let dtoOut;
    try {
      dtoOut = await this.datetimeDao.delete(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Delete.DatetimeDaoDeleteFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    const activityUpdateObject = {
      id: datetime.activityId,
      awid,
      datetimeId: null,
      frequency: {},
      notificationOffset: {},
      recurrent: false,
    };

    try {
      await this.activityDao.update(activityUpdateObject);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Delete.ActivityDaoUpdateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
  async createNext(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("datetimeCreateNextDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.CreateNext),
      Errors.CreateNext.InvalidDtoIn,
    );

    await InstanceChecker.ensureInstanceAndState(awid, Errors.CreateNext, uuAppErrorMap, authorizationResult, {
      Authorities: ["active", "restricted"],
      Executives: ["active", "restricted"],
      StandardUsers: ["active"],
    });

    let datetime;
    try {
      datetime = await this.datetimeDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.CreateNext.DatetimeDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!datetime) {
      throw new Errors.CreateNext.DatetimeDoesNotExist({ uuAppErrorMap }, { datetimeId: dtoIn.id });
    }

    let activity;
    try {
      activity = await this.activityDao.get(awid, datetime.activityId);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.CreateNext.ActivityDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!activity) {
      throw new Errors.CreateNext.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: datetime.activityId });
    }

    if (activity.recurrent === false) {
      throw new Errors.CreateNext.ActivityNotRecurrent({ uuAppErrorMap });
    }

    const nextDatetime = new Date(datetime.datetime);
    nextDatetime.setMonth(nextDatetime.getMonth() + activity.frequency.months);
    nextDatetime.setDate(nextDatetime.getDate() + activity.frequency.days);

    const nextNotification = new Date(nextDatetime);
    nextNotification.setDate(nextNotification.getDate() - activity.notificationOffset.days);
    nextNotification.setHours(
      nextNotification.getHours() - activity.notificationOffset.hours,
      nextNotification.getMinutes() - activity.notificationOffset.minutes,
    );

    try {
      await this.datetimeDao.delete(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.CreateNext.DatetimeDaoDeleteFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    const nextDatetimeObject = {
      awid,
      activityId: datetime.activityId,
      datetime: nextDatetime,
      notification: nextNotification,
      undecided: activity.members.map((member) => member.uuIdentity),
      confirmed: [],
      denied: [],
    };

    let dtoOut;
    try {
      dtoOut = await this.datetimeDao.create(nextDatetimeObject);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.CreateNext.DatetimeDaoCreateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    const updateActivityObject = {
      awid,
      id: datetime.activityId,
      datetimeId: dtoOut.id,
    };

    try {
      await this.activityDao.update(updateActivityObject);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.CreateNext.ActivityDaoUpdateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new DatetimeAbl();
