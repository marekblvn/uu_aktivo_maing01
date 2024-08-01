"use strict";
const AktivoMainUseCaseError = require("./aktivo-main-use-case-error");

const ERR_PREFIX = `${AktivoMainUseCaseError.ERROR_PREFIX}invitation/`;

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
      this.message = "Activity with provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to create invitation to this activity.";
    }
  },
  TargetUserAlreadyMember: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}targetUserAlreadyMember`;
      this.message = "Target user is already a member of this activity.";
    }
  },
  InvitationDaoGetByActivityIdAndUuIdentityFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invitationDaoGetByActivityIdAndUuIdentityFailed`;
      this.message = "Get invitation by invitation DAO getByActivityIdAndUuIdentity failed.";
    }
  },
  TargetUserAlreadyInvited: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}targetUserAlreadyInvited`;
      this.message = "Target user is already invited to this activity.";
    }
  },
  InvitationDaoCreateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invitationDaoCreateFailed`;
      this.message = "Create invitation by invitation DAO create failed.";
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
  InvitationDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invitationDaoGetFailed`;
      this.message = "Get invitation by invitation DAO get failed.";
    }
  },
  InvitationDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invitationDoesNotExist`;
      this.message = "Invitation with provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to access this invitation.";
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
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to list invitations from this activity.";
    }
  },
  InvitationDaoListFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invitationDaoListFailed`;
      this.message = "List invitations by invitation DAO list failed.";
    }
  },
};

const Accept = {
  UC_CODE: `${ERR_PREFIX}accept/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Accept.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  InvitationDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Accept.UC_CODE}invitationDaoGetFailed`;
      this.message = "Get invitation by invitation DAO get failed.";
    }
  },
  InvitationDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Accept.UC_CODE}invitationDoesNotExist`;
      this.message = "Invitation with provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Accept.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to accept this invitation.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Accept.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Accept.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with the provided id does not exist.";
    }
  },
  UserAlreadyMember: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Accept.UC_CODE}userAlreadyMember`;
      this.message = "User is already a member of the activity.";
    }
  },
  ActivityDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Accept.UC_CODE}activityDaoUpdateFailed`;
      this.message = "Update activity by activity DAO update failed.";
    }
  },
  DatetimeDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Accept.UC_CODE}datetimeDaoGetFailed`;
      this.message = "Get datetime by datetime DAO get failed.";
    }
  },
  DatetimeDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Accept.UC_CODE}datetimeDoesNotExist`;
      this.message = "Datetime with the provided id does not exist.";
    }
  },
  DatetimeDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Accept.UC_CODE}datetimeDaoUpdateFailed`;
      this.message = "Update datetime by datetime DAO update failed.";
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
  InvitationDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invitationDaoGetFailed`;
      this.message = "Get invitation by invitation DAO get failed.";
    }
  },
  InvitationDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invitationDoesNotExist`;
      this.message = "Invitation with provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to delete this invitation.";
    }
  },
  InvitationDaoDeleteFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invitationDaoDeleteFailed`;
      this.message = "Delete invitation by invitation DAO delete failed.";
    }
  },
};

module.exports = {
  Create,
  Get,
  List,
  Accept,
  Delete,
};
