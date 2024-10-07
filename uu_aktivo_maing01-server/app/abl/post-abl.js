"use strict";
const Path = require("path");
const { ObjectId } = require("mongodb");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/post-error");
const InstanceChecker = require("../api/components/instance-checker");

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

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const userUuIdentity = session.getIdentity().getUuIdentity();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      if (!activity.members.some((member) => member.uuIdentity === userUuIdentity)) {
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
    dtoIn.activityId = ObjectId.createFromHexString(dtoIn.activityId);
    dtoIn.uuIdentity = userUuIdentity;
    dtoIn.uuIdentityName = session.getIdentity().getName();
    dtoIn.createdAt = new Date(dtoIn.createdAt);

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

  async get(awid, dtoIn, authorizationResult) {
    let validationResult = this.validator.validate("postGetDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Get),
      Errors.Get.InvalidDtoIn,
    );

    await InstanceChecker.ensureInstanceAndState(awid, Errors.Get, uuAppErrorMap, authorizationResult, {
      Authorities: ["active", "restricted", "readOnly"],
      Executives: ["active", "restricted"],
    });

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

    await InstanceChecker.ensureInstanceAndState(awid, Errors.List, uuAppErrorMap, authorizationResult, {
      Authorities: ["active", "restricted", "readOnly"],
      Executives: ["active", "restricted"],
      StandardUsers: ["active"],
    });

    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const userUuIdentity = session.getIdentity().getUuIdentity();
    if (
      !authorizedProfiles.includes(PROFILE_CODES.Authorities) &&
      !authorizedProfiles.includes(PROFILE_CODES.Executives)
    ) {
      if (!dtoIn.filters || !dtoIn.filters?.activityId) {
        throw new Errors.List.UserNotAuthorized({ uuAppErrorMap });
      }

      // don't allow any other filters for StandardUsers
      dtoIn.filters = { activityId: dtoIn.filters.activityId };

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

      if (!activity.members.some((member) => member.uuIdentity === userUuIdentity)) {
        throw new Errors.List.UserNotMember({ uuAppErrorMap });
      }
    }

    const filters = {};
    if (dtoIn.filters) {
      const { activityId, uuIdentity, uuIdentityName, createdAt, type } = dtoIn.filters;

      if (activityId) {
        filters.activityId = ObjectId.createFromHexString(activityId);
      }

      if (uuIdentity) {
        filters.uuIdentity = uuIdentity;
      }

      if (uuIdentityName) {
        filters.uuIdentityName = { $regex: uuIdentityName, $options: "i" };
      }

      if (type) {
        filters.type = type;
      }

      if (createdAt && createdAt.filter((item) => item != null).length > 0) {
        filters.createdAt = {};
        if (createdAt[0]) {
          filters.createdAt.$gte = new Date(createdAt[0]);
        }

        if (createdAt[1]) {
          filters.createdAt.$lt = new Date(createdAt[1]);
        }
      }
    }

    const sort = {};
    if (dtoIn.sort) {
      const { createdAt } = dtoIn.sort;

      if (createdAt) {
        sort.createdAt = createdAt;
      }
    }

    let dtoOut;
    try {
      dtoOut = await this.postDao.list(awid, filters, dtoIn.pageInfo, sort);
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

    await InstanceChecker.ensureInstanceAndState(awid, Errors.Update, uuAppErrorMap, authorizationResult, {
      Authorities: ["active", "restricted"],
      Executives: ["active", "restricted"],
      StandardUsers: ["active"],
    });

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

      if (!activity.members.some((member) => member.uuIdentity === userUuIdentity)) {
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

    await InstanceChecker.ensureInstanceAndState(awid, Errors.Delete, uuAppErrorMap, authorizationResult, {
      Authorities: ["active", "restricted"],
      Executives: ["active", "restricted"],
      StandardUsers: ["active"],
    });

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

      if (!activity.members.some((member) => member.uuIdentity === userUuIdentity)) {
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
