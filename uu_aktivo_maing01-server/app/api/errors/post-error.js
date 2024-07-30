"use strict";
const AktivoMainUseCaseError = require("./aktivo-main-use-case-error");

const ERR_PREFIX = `${AktivoMainUseCaseError.ERROR_PREFIX}post/`;

const Create = {
  UC_CODE: `${ERR_PREFIX}create/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with the provided id does not exist.";
    }
  },
  UserNotMember: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}userNotMember`;
      this.message = "User is not a member of this activity.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to create this type of post.";
    }
  },
  PostDaoCreateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}`;
      this.message = "Create post by post DAO create failed.";
    }
  },
};

const Get = {
  UC_CODE: `${ERR_PREFIX}get/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  PostDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}postDaoGetFailed`;
      this.message = "Get post by posts DAO get failed.";
    }
  },
  PostDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}postDoesNotExist`;
      this.message = "Post with provided id does not exist.";
    }
  },
};

const List = {
  UC_CODE: `${ERR_PREFIX}list/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to list all posts.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with provided id does not exist.";
    }
  },
  UserNotMember: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}userNotMember`;
      this.message = "User is not a member of this activity.";
    }
  },
  PostDaoListByActivityIdFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}postDaoListByActivityIdFailed`;
      this.message = "List posts by post DAO listByActivityId failed.";
    }
  },
  PostDaoListFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}postDaoListFailed`;
      this.message = "List posts by post DAO list failed.";
    }
  },
};

const Update = {
  UC_CODE: `${ERR_PREFIX}update/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  PostDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}postDaoGetFailed`;
      this.message = "Get post by post DAO get failed.";
    }
  },
  PostDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}postDoesNotExist`;
      this.message = "Post with provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to update this post.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with provided id does not exist.";
    }
  },
  UserNotMember: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}userNotMember`;
      this.message = "User is not a member of this activity.";
    }
  },
  PostDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}postDaoUpdateFailed`;
      this.message = "Update post by post DAO update failed.";
    }
  },
};

const Delete = {
  UC_CODE: `${ERR_PREFIX}delete/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  PostDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}postDaoGetFailed`;
      this.message = "Get post by post DAO get failed.";
    }
  },
  PostDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}postDoesNotExist`;
      this.message = "Post with provided id does not exist.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with provided id does not exist.";
    }
  },
  UserNotMember: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}userNotMember`;
      this.message = "User is not a member of this activity.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to delete this post.";
    }
  },
  PostDaoDeleteFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}postDaoDeleteFailed`;
      this.message = "Delete post by post DAO delete failed.";
    }
  },
};

module.exports = {
  Create,
  Get,
  List,
  Update,
  Delete,
};
