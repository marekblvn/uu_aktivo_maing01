"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/activity-error");

const UnsupportedKeysWarning = (error) => `${error?.UC_CODE}unsupportedKeys`;

const PROFILE_CODES = {
  Authorities: "Authorities",
  Executives: "Executives",
  StandardUsers: "StandardUsers",
};

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

  async get(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("activityGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Get),
      Errors.Get.InvalidDtoIn,
    );

    // Get user's authorized profiles
    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();

    let activity;
    try {
      activity = await this.activityDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Get.ActivityDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    // No uuObject was returned by the DAO method
    if (!activity) {
      throw new Errors.Get.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.id });
    }

    // Check if user is only StandardUser
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      // User is only StandardUser
      const userUuIdentity = session.getIdentity().getUuIdentity();

      // Check if user is member of the activity
      if (!activity.members.includes(userUuIdentity)) {
        throw new Errors.Get.UserNotAuthorized({ uuAppErrorMap });
      }
    }
    let dtoOut = activity;
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
  async list(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("activityListDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.List),
      Errors.List.InvalidDtoIn,
    );

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    console.log("USER AUTHORIZED PROFILES: ", authorizedProfiles);
    let daoFilter = {};
    if (
      authorizedProfiles.includes(PROFILE_CODES.Authorities) ||
      authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      if (dtoIn.filters?.recurrent !== undefined) {
        daoFilter.recurrent = dtoIn.filters.recurrent;
      }
      if (dtoIn.filters?.owner) {
        daoFilter.owner = dtoIn.filters.owner;
      }
      if (dtoIn.filters?.members?.length) {
        daoFilter.members = {
          $all: dtoIn.filters.members,
        };
      }
    } else {
      daoFilter = {
        members: {
          $in: [session.getIdentity().getUuIdentity()],
        },
      };
    }
    const pageInfo = dtoIn.pageInfo || { pageIndex: 0, pageSize: 10 };
    let dtoOut;
    try {
      dtoOut = await this.activityDao.list(awid, daoFilter, pageInfo);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.List.ActivityDaoListFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async update(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("activityUpdateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Update),
      Errors.Update.InvalidDtoIn,
    );
    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();

    let activity;
    try {
      activity = await this.activityDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Update.ActivityDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    if (!activity) {
      throw new Errors.Update.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.id });
    }

    // Check if user is only StandardUser
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      // User is only StandardUser
      const userUuIdentity = session.getIdentity().getUuIdentity();

      // Check if user is just a member, not administrator or owner
      if (!activity.administrators.includes(userUuIdentity) && activity.owner !== userUuIdentity) {
        // If so, throw error - user is not authorized to update the activity
        throw new Errors.Update.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    let dtoOut;
    try {
      dtoOut = await this.activityDao.update({ awid, ...dtoIn });
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Update.ActivityDaoUpdateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new ActivityAbl();
