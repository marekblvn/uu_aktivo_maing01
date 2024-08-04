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
    this.datetimeDao = DaoFactory.getDao("datetime");
    this.postDao = DaoFactory.getDao("post");
    this.invitationDao = DaoFactory.getDao("invitation");
    this.attendanceDao = DaoFactory.getDao("attendance");
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

  async updateFrequency(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("activityUpdateFrequencyDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.UpdateFrequency),
      Errors.UpdateFrequency.InvalidDtoIn,
    );
    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();

    let activity;
    try {
      activity = await this.activityDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.UpdateFrequency.ActivityDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!activity) {
      throw new Errors.UpdateFrequency.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.id });
    }

    // Check if user is only StandardUser
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      // User is only StandardUser
      const userUuIdentity = session.getIdentity().getUuIdentity();

      // Check if user is just a member, not owner
      if (activity.owner !== userUuIdentity) {
        // If so, throw error - user is not authorized to update the activity
        throw new Errors.Update.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    if (activity.datetimeId === null) {
      throw new Errors.UpdateFrequency.ActivityDoesNotHaveDatetime({ uuAppErrorMap });
    }

    if (activity.recurrent === false) {
      throw new Errors.UpdateFrequency.ActivityNotRecurrent({ uuAppErrorMap });
    }

    if (dtoIn.frequency.days === 0 && dtoIn.frequency.months === 0) {
      throw new Errors.UpdateFrequency.FrequencyCannotBeZero({ uuAppErrorMap });
    }

    let datetime;
    try {
      datetime = await this.datetimeDao.get(awid, activity.datetimeId);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.UpdateFrequency.DatetimeDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    const datetimeNext = new Date(datetime.datetime);
    datetimeNext.setMonth(datetimeNext.getMonth() + dtoIn.frequency.months);
    datetimeNext.setDate(datetimeNext.getDate() + dtoIn.frequency.days);
    const notificationDate = new Date(datetimeNext);
    notificationDate.setDate(notificationDate.getDate() - activity.notificationOffset.days);
    notificationDate.setHours(
      notificationDate.getHours() - activity.notificationOffset.hours,
      notificationDate.getMinutes() - activity.notificationOffset.minutes,
    );

    // new frequency can NOT be "greater" than existing notification offset -> in that case, the notification date would be before the next datetime is calculated
    if (notificationDate <= datetime.datetime) {
      throw new Errors.UpdateFrequency.InvalidFrequency({ uuAppErrorMap });
    }

    let dtoOut;
    try {
      dtoOut = await this.activityDao.update({ awid, ...dtoIn });
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.UpdateFrequency.ActivityDaoUpdateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async updateNotificationOffset(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("activityUpdateNotificationOffsetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.UpdateNotificationOffset),
      Errors.UpdateNotificationOffset.InvalidDtoIn,
    );
    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();

    let activity;
    try {
      activity = await this.activityDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.UpdateNotificationOffset.ActivityDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    if (!activity) {
      throw new Errors.UpdateNotificationOffset.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.id });
    }

    // Check if user is only StandardUser
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      // User is only StandardUser
      const userUuIdentity = session.getIdentity().getUuIdentity();

      // Check if user is just a member, not owner
      if (activity.owner !== userUuIdentity) {
        // If so, throw error - user is not authorized to update the activity
        throw new Errors.UpdateNotificationOffset.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    if (activity.datetimeId === null) {
      throw new Errors.UpdateNotificationOffset.ActivityDoesNotHaveDatetime({ uuAppErrorMap });
    }

    const notificationOffsetInHours =
      dtoIn.notificationOffset.days * 24 + dtoIn.notificationOffset.hours + dtoIn.notificationOffset.minutes / 60;

    if (notificationOffsetInHours < 1) {
      throw new Errors.UpdateNotificationOffset.InvalidNotificationOffset({ uuAppErrorMap });
    }

    if (activity.frequency) {
      let datetime;
      try {
        datetime = await this.datetimeDao.get(awid, activity.datetimeId);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.UpdateNotificationOffset.DatetimeDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      const datetimeNext = new Date(datetime.datetime);
      datetimeNext.setMonth(datetimeNext.getMonth() + activity.frequency.months);
      datetimeNext.setDate(datetimeNext.getDate() + activity.frequency.days);
      const notificationDate = new Date(datetimeNext);
      notificationDate.setDate(notificationDate.getDate() - dtoIn.notificationOffset.days);
      notificationDate.setHours(
        notificationDate.getHours() - dtoIn.notificationOffset.hours,
        notificationDate.getMinutes() - dtoIn.notificationOffset.minutes,
      );

      if (notificationDate <= datetime.datetime) {
        throw new Errors.UpdateNotificationOffset.InvalidCombination({ uuAppErrorMap });
      }
    }

    let dtoOut;
    try {
      dtoOut = await this.activityDao.update({ awid, ...dtoIn });
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.UpdateNotificationOffset.ActivityDaoUpdateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async addAdministrator(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("activityAddAdministratorDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.AddAdministrator),
      Errors.AddAdministrator.InvalidDtoIn,
    );
    let activity;
    try {
      activity = await this.activityDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.AddAdministrator.ActivityDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    if (!activity) {
      throw new Errors.AddAdministrator.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.id });
    }

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const userUuIdentity = session.getIdentity().getUuIdentity();

    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      if (activity.owner !== userUuIdentity) {
        throw new Errors.UpdateNotificationOffset.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    if (dtoIn.uuIdentity === activity.owner) {
      throw new Errors.AddAdministrator.OwnerCannotBeAdministrator({ uuAppErrorMap });
    }

    if (!activity.members.includes(dtoIn.uuIdentity)) {
      throw new Errors.AddAdministrator.TargetUserIsNotMember({ uuAppErrorMap });
    }

    if (activity.administrators.includes(dtoIn.uuIdentity)) {
      throw new Errors.AddAdministrator.TargetUserAlreadyAdministrator({ uuAppErrorMap });
    }

    let dtoOut;
    const updateObject = { id: dtoIn.id, awid, $push: { administrators: dtoIn.uuIdentity } };
    try {
      dtoOut = await this.activityDao.update(updateObject);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.AddAdministrator.ActivityDaoUpdateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async removeAdministrator(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("activityRemoveAdministratorDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.RemoveAdministrator),
      Errors.RemoveAdministrator.InvalidDtoIn,
    );
    let activity;
    try {
      activity = await this.activityDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.RemoveAdministrator.ActivityDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!activity) {
      throw new Errors.RemoveAdministrator.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.id });
    }

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const userUuIdentity = session.getIdentity().getUuIdentity();

    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      if (userUuIdentity !== activity.owner) {
        throw new Errors.RemoveAdministrator.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    if (!activity.members.includes(dtoIn.uuIdentity)) {
      throw new Errors.RemoveAdministrator.TargetUserIsNotMember({ uuAppErrorMap });
    }

    if (!activity.administrators.includes(dtoIn.uuIdentity)) {
      throw new Errors.RemoveAdministrator.TargetUserNotAdministrator({ uuAppErrorMap });
    }

    const updateObject = { id: dtoIn.id, awid, $pull: { administrators: dtoIn.uuIdentity } };

    let dtoOut;
    try {
      dtoOut = await this.activityDao.update(updateObject);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.RemoveAdministrator.ActivityDaoUpdateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async transferOwnership(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("activityTransferOwnershipDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.TransferOwnership),
      Errors.TransferOwnership.InvalidDtoIn,
    );
    let activity;
    try {
      activity = await this.activityDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.TransferOwnership.ActivityDaoGetFailed({ uuAppErrorMap });
      }
      throw error;
    }
    if (!activity) {
      throw new Errors.TransferOwnership.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.id });
    }

    if (activity.datetimeId !== null) {
      throw new Errors.TransferOwnership.ActivityHasDatetime({ uuAppErrorMap });
    }

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      const userUuIdentity = session.getIdentity().getUuIdentity();
      if (userUuIdentity !== activity.owner) {
        throw new Errors.TransferOwnership.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    if (!activity.members.includes(dtoIn.uuIdentity)) {
      throw new Errors.TransferOwnership.TargetUserIsNotMember({ uuAppErrorMap });
    }

    let administratorsUpdate = {};
    if (activity.administrators.includes(dtoIn.uuIdentity)) {
      administratorsUpdate = { $pull: { administrators: dtoIn.uuIdentity } };
    }

    const updateObject = { id: dtoIn.id, awid, owner: dtoIn.uuIdentity, ...administratorsUpdate };
    let dtoOut;
    try {
      dtoOut = await this.activityDao.update(updateObject);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.TransferOwnership.ActivityDaoUpdateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async removeMember(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("activityRemoveMemberDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.TransferOwnership),
      Errors.TransferOwnership.InvalidDtoIn,
    );

    let activity;
    try {
      activity = await this.activityDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.RemoveMember.ActivityDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!activity) {
      throw new Errors.RemoveMember.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.id });
    }

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const userUuIdentity = session.getIdentity().getUuIdentity();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      if (userUuIdentity !== activity.owner && !activity.administrators.includes(userUuIdentity)) {
        throw new Errors.RemoveMember.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    let administratorsUpdate = {};
    if (dtoIn.uuIdentity === activity.owner) {
      throw new Errors.RemoveMember.TargetUserIsOwner({ uuAppErrorMap });
    } else if (activity.administrators.includes(dtoIn.uuIdentity)) {
      if (userUuIdentity !== activity.owner) {
        throw new Errors.RemoveMember.TargetUserIsAdministrator({ uuAppErrorMap });
      } else {
        administratorsUpdate = { $pull: { administrators: dtoIn.uuIdentity } };
      }
    } else if (!activity.members.includes(dtoIn.uuIdentity)) {
      throw new Errors.RemoveMember.TargetUserIsNotMember({ uuAppErrorMap });
    }

    let dtoOut;
    const updateObject = {
      id: dtoIn.id,
      awid,
      $pull: { members: dtoIn.uuIdentity },
      ...administratorsUpdate,
    };

    try {
      dtoOut = await this.activityDao.update(updateObject);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.RemoveMember.ActivityDaoUpdateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (activity.datetimeId !== null) {
      let datetime;
      try {
        datetime = await this.datetimeDao.get(awid, activity.datetimeId);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.RemoveMember.DatetimeDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!datetime) {
        throw new Errors.RemoveMember.DatetimeDoesNotExist({ uuAppErrorMap }, { datetimeId: activity.datetimeId });
      }

      const datetimeUpdatedObject = {
        id: datetime.id,
        awid,
        $pull: {
          confirmed: dtoIn.uuIdentity,
          denied: dtoIn.uuIdentity,
          undecided: dtoIn.uuIdentity,
        },
      };

      try {
        await this.datetimeDao.update(datetimeUpdatedObject);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.RemoveMember.DatetimeDaoUpdateFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async leave(awid, dtoIn, session) {
    let validationResult = this.validator.validate("activityLeaveDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Leave),
      Errors.Leave.InvalidDtoIn,
    );

    let activity;
    try {
      activity = await this.activityDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Leave.ActivityDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!activity) {
      throw new Errors.Leave.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.id });
    }

    const userUuIdentity = session.getIdentity().getUuIdentity();

    if (!activity.members.includes(userUuIdentity)) {
      throw new Errors.Leave.UserNotAuthorized({ uuAppErrorMap });
    }

    if (activity.owner === userUuIdentity) {
      throw new Errors.Leave.UserIsOwner({ uuAppErrorMap });
    }

    let dtoOut;
    const updateObject = {
      id: dtoIn.id,
      awid,
      $pull: {
        administrators: userUuIdentity,
        members: userUuIdentity,
      },
    };

    try {
      dtoOut = await this.activityDao.update(updateObject);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Leave.ActivityDaoUpdateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (activity.datetimeId !== null) {
      let datetime;
      try {
        datetime = await this.datetimeDao.get(awid, activity.datetimeId);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Leave.DatetimeDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!datetime) {
        throw new Errors.Leave.DatetimeDoesNotExist({ uuAppErrorMap }, { datetimeId: activity.datetimeId });
      }

      const datetimeUpdatedObject = {
        id: datetime.id,
        awid,
        $pull: {
          confirmed: userUuIdentity,
          denied: userUuIdentity,
          undecided: userUuIdentity,
        },
      };

      try {
        await this.datetimeDao.update(datetimeUpdatedObject);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Leave.DatetimeDaoUpdateFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async delete(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("activityDeleteDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Delete),
      Errors.Delete.InvalidDtoIn,
    );

    let activity;
    try {
      activity = await this.activityDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Delete.ActivityDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!activity) {
      throw new Errors.Delete.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.id });
    }

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      const userUuIdentity = session.getIdentity().getUuIdentity();
      if (activity.owner !== userUuIdentity) {
        throw new Errors.Delete.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    try {
      await this.attendanceDao.deleteByActivityId(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Delete.AttendanceDaoDeleteByActivityIdFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    try {
      await this.postDao.deleteByActivityId(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Delete.PostDaoDeleteByActivityIdFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    try {
      await this.invitationDao.deleteByActivityId(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Delete.InvitationDaoDeleteByActivityIdFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    try {
      await this.datetimeDao.deleteByActivityId(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Delete.DatetimeDaoDeleteByActivityIdFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    let dtoOut;
    try {
      dtoOut = await this.activityDao.delete(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Delete.ActivityDaoDeleteFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new ActivityAbl();
