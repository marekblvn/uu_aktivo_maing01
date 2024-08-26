"use strict";
const Path = require("path");
const { ObjectId } = require("mongodb");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/invitation-error");

const UnsupportedKeysWarning = (error) => `${error?.UC_CODE}unsupportedKeys`;

const PROFILE_CODES = {
  Authorities: "Authorities",
  Executives: "Executives",
  StandardUsers: "StandardUsers",
};

class InvitationAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "invitation-types.js"));
    this.invitationDao = DaoFactory.getDao("invitation");
    this.invitationDao.createSchema();
    this.activityDao = DaoFactory.getDao("activity");
    this.datetimeDao = DaoFactory.getDao("datetime");
  }
  async create(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("invitationCreateDtoInType", dtoIn);
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
      throw new Errors.Create.ActivityDoesNotExist({ uuAppErrorMap });
    }

    if (activity.members.length >= 100) {
      throw new Errors.Create.ActivityMemberLimitReached({ uuAppErrorMap });
    }

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const userUuIdentity = session.getIdentity().getUuIdentity();

    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      if (!activity.administrators.includes(userUuIdentity) && activity.owner !== userUuIdentity) {
        throw new Errors.Create.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    if (activity.members.includes(dtoIn.uuIdentity)) {
      throw new Errors.Create.TargetUserAlreadyMember({ uuAppErrorMap });
    }

    let invitation;
    try {
      invitation = await this.invitationDao.getByActivityIdAndUuIdentity(awid, dtoIn.activityId, dtoIn.uuIdentity);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Create.InvitationDaoGetByActivityIdAndUuIdentityFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (invitation) {
      throw new Errors.Create.TargetUserAlreadyInvited({ uuAppErrorMap });
    }

    dtoIn.awid = awid;
    dtoIn.activityId = activity.id;
    let dtoOut;
    try {
      dtoOut = await this.invitationDao.create(dtoIn);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Create.InvitationDaoCreateFailed({ uuAppErrorMap });
      }
      throw error;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
  async get(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("invitationGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Get),
      Errors.Get.InvalidDtoIn,
    );

    let invitation;
    try {
      invitation = await this.invitationDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Get.InvitationDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!invitation) {
      throw new Errors.Get.InvitationDoesNotExist({ uuAppErrorMap }, { invitationId: dtoIn.id });
    }

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      const userUuIdentity = session.getIdentity().getUuIdentity();
      if (invitation.uuIdentity !== userUuIdentity) {
        throw new Errors.Get.UserNotAuthorized({ uuAppErrorMap });
      }
    }

    let dtoOut = { ...invitation, uuAppErrorMap };
    return dtoOut;
  }
  async list(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("invitationListDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.List),
      Errors.List.InvalidDtoIn,
    );

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const userUuIdentity = session.getIdentity().getUuIdentity();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      if (!dtoIn.filters || !dtoIn.filters?.activityId) {
        dtoIn.filters = {
          uuIdentity: userUuIdentity,
        };
      } else if (dtoIn.filters?.activityId) {
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
          throw new Errors.List.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.activityId });
        }

        if (!activity.administrators.includes(userUuIdentity) && activity.owner !== userUuIdentity) {
          throw new Errors.List.UserNotAuthorized({ uuAppErrorMap });
        }

        dtoIn.filters = {
          activityId: dtoIn.filters.activityId,
        };
      }
    }

    if (dtoIn.filters?.activityId) {
      dtoIn.filters.activityId = ObjectId.createFromHexString(dtoIn.filters.activityId);
    }

    let dtoOut;
    const pageInfo = {
      pageIndex: parseInt(dtoIn.pageInfo?.pageIndex) || 0,
      pageSize: parseInt(dtoIn.pageInfo?.pageSize || 100),
    };
    try {
      [dtoOut] = await this.invitationDao.list(awid, dtoIn.filters, pageInfo);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.List.InvitationDaoListFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }
    if (!dtoOut) {
      dtoOut = {};
      dtoOut.itemList = [];
      dtoOut.pageInfo = pageInfo;
      dtoOut.pageInfo.total = 0;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
  async accept(awid, dtoIn, session) {
    let validationResult = this.validator.validate("invitationAcceptDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Accept),
      Errors.Accept.InvalidDtoIn,
    );

    let invitation;
    try {
      invitation = await this.invitationDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Accept.InvitationDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!invitation) {
      throw new Errors.Accept.InvitationDoesNotExist({ uuAppErrorMap }, { invitationId: dtoIn.id });
    }

    const userUuIdentity = session.getIdentity().getUuIdentity();

    if (invitation.uuIdentity !== userUuIdentity) {
      throw new Errors.Accept.UserNotAuthorized({ uuAppErrorMap });
    }

    let activity;
    try {
      activity = await this.activityDao.get(awid, invitation.activityId);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Accept.ActivityDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!activity) {
      throw new Errors.Accept.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: invitation.activityId });
    }

    if (activity.members.length >= 100) {
      throw new Errors.Accept.ActivityMemberLimitReached({ uuAppErrorMap });
    }

    if (activity.members.includes(invitation.uuIdentity)) {
      throw new Errors.Accept.UserAlreadyMember({ uuAppErrorMap });
    }

    const updateObject = { id: invitation.activityId, awid, $push: { members: invitation.uuIdentity } };
    try {
      await this.activityDao.update(updateObject);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Accept.ActivityDaoUpdateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    let dtoOut;
    try {
      dtoOut = await this.invitationDao.delete(awid, dtoIn.id);
    } catch (error) {
      throw new Errors.Accept.InvitationDaoDeleteFailed({ uuAppErrorMap }, error);
    }

    if (activity.datetimeId !== null) {
      let datetime;
      try {
        datetime = await this.datetimeDao.get(awid, activity.datetimeId);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Accept.DatetimeDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!datetime) {
        throw new Errors.Accept.DatetimeDoesNotExist({ uuAppErrorMap }, { datetimeId: activity.datetimeId });
      }

      const datetimeUpdateObject = { id: datetime.id, awid, $push: { undecided: invitation.uuIdentity } };
      try {
        await this.datetimeDao.update(datetimeUpdateObject);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Accept.DatetimeDaoUpdateFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
  async delete(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("invitationDeleteDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Delete),
      Errors.Delete.InvalidDtoIn,
    );

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      let invitation;
      try {
        invitation = await this.invitationDao.get(awid, dtoIn.id);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Delete.InvitationDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!invitation) {
        throw new Errors.Delete.InvitationDoesNotExist({ uuAppErrorMap }, { invitationId: dtoIn.id });
      }

      let activity;
      try {
        activity = await this.activityDao.get(awid, invitation.activityId);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Delete.ActivityDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!activity) {
        throw new Errors.Delete.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: invitation.activityId });
      }

      const userUuIdentity = session.getIdentity().getUuIdentity();
      if (invitation.uuIdentity !== userUuIdentity) {
        if (!activity.administrators.includes(userUuIdentity) && activity.owner !== userUuIdentity) {
          throw new Errors.Delete.UserNotAuthorized({ uuAppErrorMap });
        }
      }
    }
    let dtoOut;
    try {
      dtoOut = await this.invitationDao.delete(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Delete.InvitationDaoDeleteFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new InvitationAbl();
