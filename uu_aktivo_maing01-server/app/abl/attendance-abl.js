"use strict";
const Path = require("path");
const { ObjectId } = require("mongodb");
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
      confirmed: datetime.confirmed,
      denied: datetime.denied,
      undecided: datetime.undecided,
      datetime: datetime.datetime,
      activityId: activity.id,
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

  async get(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("attendanceGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Get),
      Errors.Get.InvalidDtoIn,
    );

    let dtoOut;
    try {
      dtoOut = await this.attendanceDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Get.AttendanceDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!dtoOut) {
      throw new Errors.Get.AttendanceDoesNotExist({ uuAppErrorMap }, { attendanceId: dtoIn.id });
    }

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      let activity;
      try {
        await this.activityDao.get(awid, dtoOut.activityId);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Get.ActivityDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!activity) {
        throw new Errors.Get.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoOut.activityId });
      }

      const userUuIdentity = session.getIdentity().getUuIdentity();
      if (!activity.members.includes(userUuIdentity)) {
        throw new Errors.Get.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async list(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("attendanceListDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.List),
      Errors.List.InvalidDtoIn,
    );

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      if (!dtoIn.filters?.activityId) {
        throw new Errors.List.UserNotAuthorized({ uuAppErrorMap });
      }

      let activity;
      try {
        activity = await this.activityDao.get(awid, dtoIn.filters.activityId);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.List.ActivityDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!activity) {
        throw new Errors.List.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.filters.activityId });
      }

      const userUuIdentity = session.getIdentity().getUuIdentity();
      if (!activity.members.includes(userUuIdentity)) {
        throw new Errors.List.UserNotMember({ uuAppErrorMap });
      }
    }

    const filters = {};
    if (dtoIn.filters) {
      const { activityId, datetime } = dtoIn.filters;

      if (activityId) {
        filters.activityId = ObjectId.createFromHexString(activityId);
      }

      if (datetime && datetime.filter((item) => item != null).length > 0) {
        filters.datetime = {};
        if (datetime[0]) {
          filters.datetime.$gte = new Date(datetime[0]);
        }
        if (datetime[1]) {
          filters.datetime.$lt = new Date(datetime[1]);
        }
      }
    }

    const sort = {};
    if (dtoIn.sort) {
      const { datetime } = dtoIn.sort;
      if (datetime) {
        sort.datetime = datetime;
      }
    }

    let dtoOut;
    try {
      dtoOut = await this.attendanceDao.list(awid, filters, dtoIn.pageInfo, sort);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.List.AttendanceDaoListFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async getStatistics(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("attendanceGetStatisticsDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.GetStatistics),
      Errors.GetStatistics.InvalidDtoIn,
    );

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      if (!dtoIn.filters?.activityId) {
        throw new Errors.GetStatistics.UserNotAuthorized({ uuAppErrorMap });
      }

      let activity;
      try {
        activity = await this.activityDao.get(awid, dtoIn.filters.activityId);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.GetStatistics.ActivityDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!activity) {
        throw new Errors.GetStatistics.ActivityDoesNotExist(
          { uuAppErrorMap },
          { activityId: dtoIn.filters.activityId },
        );
      }

      const userUuIdentity = session.getIdentity().getUuIdentity();
      if (!activity.members.includes(userUuIdentity)) {
        throw new Errors.GetStatistics.UserNotMember({ uuAppErrorMap });
      }
    }

    const { filters } = dtoIn;
    const queryFilters = {};
    if (filters) {
      const { after, before, activityId } = filters;
      if (activityId) {
        queryFilters.activityId = ObjectId.createFromHexString(activityId);
      }
      if (after) {
        queryFilters.datetime = { $gte: new Date(after) };
      }
      if (before) {
        queryFilters.datetime = queryFilters.datetime || {};
        queryFilters.datetime.$lt = new Date(before);
      }
    }

    let statistics;
    let total;
    try {
      statistics = await this.attendanceDao.getStatistics(awid, queryFilters);
      total = await this.attendanceDao.count({ ...queryFilters, awid });
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.GetStatistics.AttendanceDaoGetStatisticsFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    statistics.forEach((item) => {
      item.total = total;
    });

    let dtoOut = {};
    dtoOut.statistics = statistics;
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async delete(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("attendanceDeleteDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Delete),
      Errors.Delete.InvalidDtoIn,
    );

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const userUuIdentity = session.getIdentity().getUuIdentity();

    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      let attendance;
      try {
        attendance = await this.attendanceDao.get(awid, dtoIn.id);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Delete.AttendanceDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!attendance) {
        throw new Errors.Delete.AttendanceDoesNotExist({ uuAppErrorMap }, { attendanceId: dtoIn.id });
      }

      let activity;
      try {
        activity = this.activityDao.get(awid, attendance.activityId);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Delete.ActivityDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!activity) {
        throw new Errors.Delete.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: attendance.activityId });
      }

      if (!activity.administrators.includes(userUuIdentity) && activity.owner !== userUuIdentity) {
        throw new Errors.Delete.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    let dtoOut;
    try {
      dtoOut = await this.attendanceDao.delete(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Delete.AttendanceDaoDeleteFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async deleteBulk(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("attendanceDeleteBulkDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.DeleteBulk),
      Errors.DeleteBulk.InvalidDtoIn,
    );

    const { idList } = dtoIn;

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      const userUuIdentity = session.getIdentity().getUuIdentity();
      const activityIdSet = new Set();
      for (const id of idList) {
        let attendance;
        try {
          attendance = await this.attendanceDao.get(awid, id);
        } catch (error) {
          if (error instanceof ObjectStoreError) {
            throw new Errors.DeleteBulk.AttendanceDaoGetFailed({ uuAppErrorMap }, error);
          }
          throw error;
        }
        if (!attendance) {
          throw new Errors.DeleteBulk.AttendanceDoesNotExist({ uuAppErrorMap }, { attendanceId: id });
        }
        const activityIdAsString = attendance.activityId.toString();
        if (!activityIdSet.has(activityIdAsString)) {
          let activity;
          try {
            activity = await this.activityDao.get(awid, attendance.activityId);
          } catch (error) {
            if (error instanceof ObjectStoreError) {
              throw new Errors.DeleteBulk.ActivityDaoGetFailed({ uuAppErrorMap }, error);
            }
            throw error;
          }
          if (!activity) {
            throw new Errors.DeleteBulk.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: attendance.activityId });
          }

          if (activity.owner !== userUuIdentity && !activity.administrators.includes(userUuIdentity)) {
            throw new Errors.DeleteBulk.UserNotAuthorized({ uuAppErrorMap }, { activityId: activity.id });
          }
          activityIdSet.add(activityIdAsString);
        }
      }
    }

    const idsAsObjectId = idList.map((id) => ObjectId.createFromHexString(id));

    try {
      await this.attendanceDao.deleteByIdList(awid, idsAsObjectId);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.DeleteBulk.AttendanceDaoDeleteByIdListFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    const dtoOut = {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new AttendanceAbl();
