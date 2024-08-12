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
      if (dtoIn.type === "important") {
        if (!activity.administrators.includes(userUuIdentity) && activity.owner !== userUuIdentity) {
          throw new Errors.Create.UserNotAuthorized({ uuAppErrorMap });
        }
      }
    }

    if (!dtoIn.type) {
      dtoIn.type = "normal";
    }
    dtoIn.awid = awid;
    dtoIn.uuIdentity = userUuIdentity;
    dtoIn.uuIdentityName = session.getIdentity().getName();
    dtoIn.createdAt = new Date();

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

  async get(awid, dtoIn) {
    let validationResult = this.validator.validate("postGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Get),
      Errors.Get.InvalidDtoIn,
    );

    let dtoOut;
    try {
      dtoOut = await this.postDao.get(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Get.PostDaoGetFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    if (!dtoOut) {
      throw new Errors.Get.PostDoesNotExist({ uuAppErrorMap }, { postId: dtoIn.id });
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async list(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("postListDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.List),
      Errors.List.InvalidDtoIn,
    );

    let filters = dtoIn.filters;
    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const userUuIdentity = session.getIdentity().getUuIdentity();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      if (!dtoIn.filters || !dtoIn.filters?.activityId) {
        throw new Errors.List.UserNotAuthorized({ uuAppErrorMap });
      }

      filters = { activityId: dtoIn.filters.activityId };

      let activity;
      try {
        activity = await this.activityDao.get(awid, dtoIn.activityId);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.List.ActivityDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!activity) {
        throw new Errors.List.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: dtoIn.activityId });
      }

      if (!activity.members.includes(userUuIdentity)) {
        throw new Errors.List.UserNotMember({ uuAppErrorMap });
      }
    }

    let dtoOut;

    try {
      dtoOut = await this.postDao.list(awid, filters, dtoIn.pageInfo, dtoIn.sort);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.List.PostDaoListFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async update(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("postUpdateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Update),
      Errors.Update.InvalidDtoIn,
    );

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      const userUuIdentity = session.getIdentity().getUuIdentity();
      let post;
      try {
        post = await this.postDao.get(awid, dtoIn.id);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Update.PostDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!post) {
        throw new Errors.Update.PostDoesNotExist({ uuAppErrorMap }, { postId: dtoIn.id });
      }

      if (post.uuIdentity !== userUuIdentity) {
        throw new Errors.Update.UserNotAuthorized({ uuAppErrorMap });
      }

      let activity;
      try {
        activity = await this.activityDao.get(awid, post.activityId);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Update.ActivityDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!activity) {
        throw new Errors.Update.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: post.activityId });
      }

      if (!activity.members.includes(userUuIdentity)) {
        throw new Errors.Update.UserNotMember({ uuAppErrorMap });
      }

      if (dtoIn.type === "important") {
        if (!activity.administrators.includes(userUuIdentity) && activity.owner !== userUuIdentity) {
          throw new Errors.Update.UserNotAdministratorOrOwner({ uuAppErrorMap });
        }
      }
    }

    let dtoOut;
    const updateObject = { awid, ...dtoIn };
    try {
      dtoOut = await this.postDao.update(updateObject);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Update.PostDaoUpdateFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async delete(awid, dtoIn, session, authorizationResult) {
    let validationResult = this.validator.validate("postDeleteDtoInType", dtoIn);
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
      const userUuIdentity = session.getIdentity().getUuIdentity();
      let post;
      try {
        post = await this.postDao.get(awid, dtoIn.id);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Delete.PostDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!post) {
        throw new Errors.Delete.PostDoesNotExist({ uuAppErrorMap }, { postId: dtoIn.id });
      }

      let activity;
      try {
        activity = await this.activityDao.get(awid, post.activityId);
      } catch (error) {
        if (error instanceof ObjectStoreError) {
          throw new Errors.Delete.ActivityDaoGetFailed({ uuAppErrorMap }, error);
        }
        throw error;
      }

      if (!activity) {
        throw new Errors.Delete.ActivityDoesNotExist({ uuAppErrorMap }, { activityId: post.activityId });
      }

      if (!activity.members.includes(userUuIdentity)) {
        throw new Errors.Delete.UserNotMember({ uuAppErrorMap });
      }

      if (!activity.administrators.includes(userUuIdentity) && activity.owner !== userUuIdentity) {
        if (post.uuIdentity !== userUuIdentity) {
          throw new Errors.Delete.UserNotAuthorized({ uuAppErrorMap });
        }
      }
    }

    let dtoOut;
    try {
      dtoOut = await this.postDao.delete(awid, dtoIn.id);
    } catch (error) {
      if (error instanceof ObjectStoreError) {
        throw new Errors.Delete.PostDaoDeleteFailed({ uuAppErrorMap }, error);
      }
      throw error;
    }

    dtoOut = dtoOut || {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new PostAbl();
