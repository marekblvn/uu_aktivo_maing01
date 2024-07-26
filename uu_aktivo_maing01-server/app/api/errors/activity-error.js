"use strict";
const AktivoMainUseCaseError = require("./aktivo-main-use-case-error");

const ERR_PREFIX = `${AktivoMainUseCaseError.ERROR_PREFIX}activity/`;

const Create = {
  UC_CODE: `${ERR_PREFIX}create/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ActivityDaoCreateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}activityDaoCreateFailed`;
      this.message = "Create activity by activity DAO create failed.";
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
      this.message = "Activity with the provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to update this activity.";
    }
  },
  ActivityDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}activityDaoUpdateFailed`;
      this.message = "Update activity by activity DAO update failed.";
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
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to access this activity.";
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
  ActivityDaoListFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}activityDaoListFailed`;
      this.message = "List activities by activity DAO list failed.";
    }
  },
};

const AddAdministrator = {
  UC_CODE: `${ERR_PREFIX}addAdministrator`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${AddAdministrator.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${AddAdministrator.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${AddAdministrator.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${AddAdministrator.UC_CODE}userNotAuthorized`;
      this.message = "User not authorized to add an administrator in this activity.";
    }
  },
  TargetUserIsNotMember: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${AddAdministrator.UC_CODE}targetUserIsNotMember`;
      this.message = "Target user is not a member of this activity.";
    }
  },
  TargetUserAlreadyAdministrator: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${AddAdministrator.UC_CODE}targetUserAlreadyAdministrator`;
      this.message = "Target user is already an administrator of this activity.";
    }
  },
  ActivityDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${AddAdministrator.UC_CODE}activityDaoUpdateFailed`;
      this.message = "Update activity by activity DAO update failed.";
    }
  },
};

const RemoveAdministrator = {
  UC_CODE: `${ERR_PREFIX}removeAdministrator`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveAdministrator.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveAdministrator.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveAdministrator.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveAdministrator.UC_CODE}userNotAuthorized`;
      this.message = "User not authorized to remove an administrator in this activity.";
    }
  },
  TargetUserIsNotMember: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveAdministrator.UC_CODE}targetUserIsNotMember`;
      this.message = "Target user is not a member of this activity.";
    }
  },
  TargetUserNotAdministrator: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveAdministrator.UC_CODE}targetUserNotAdministrator`;
      this.message = "Target user is not an administrator of this activity.";
    }
  },
  ActivityDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveAdministrator.UC_CODE}activityDaoUpdateFailed`;
      this.message = "Update activity by activity DAO update failed.";
    }
  },
};

const TransferOwnership = {
  UC_CODE: `${ERR_PREFIX}transferOwnership`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${TransferOwnership.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${TransferOwnership.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${TransferOwnership.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${TransferOwnership.UC_CODE}userNotAuthorized`;
      this.message = "User not authorized to transfer ownership of this activity.";
    }
  },
  TargetUserIsNotMember: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${TransferOwnership.UC_CODE}targetUserIsNotMember`;
      this.message = "Target user is not a member of this activity.";
    }
  },
  ActivityDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${TransferOwnership.UC_CODE}activityDaoUpdateFailed`;
      this.message = "Update activity by activity DAO update failed.";
    }
  },
};

const RemoveMember = {
  UC_CODE: `${ERR_PREFIX}removeMember`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveMember.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveMember.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveMember.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveMember.UC_CODE}userNotAuthorized`;
      this.message = "User not authorized to remove member from this activity.";
    }
  },
  TargetUserIsOwner: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveMember.UC_CODE}targetUserIsOwner`;
      this.message = "Target user is the owner of the activity and cannot be removed.";
    }
  },
  TargetUserIsNotMember: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveMember.UC_CODE}targetUserIsNotMember`;
      this.message = "Target user is not a member of this activity.";
    }
  },
  ActivityDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveMember.UC_CODE}activityDaoUpdateFailed`;
      this.message = "Update activity by activity DAO update failed.";
    }
  },
  DatetimeDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveMember.UC_CODE}datetimeDaoGetFailed`;
      this.message = "Get datetime by datetime DAO get failed.";
    }
  },
  DatetimeDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveMember.UC_CODE}datetimeDoesNotExist`;
      this.message = "Datetime with the provided id does not exist.";
    }
  },
  DatetimeDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveMember.UC_CODE}datetimeDaoUpdateFailed`;
      this.message = "Update datetime by datetime DAO update failed.";
    }
  },
};

const Leave = {
  UC_CODE: `${ERR_PREFIX}leave`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Leave.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Leave.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Leave.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Leave.UC_CODE}userNotAuthorized`;
      this.message = "User is not a member of this activity.";
    }
  },
  UserIsOwner: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Leave.UC_CODE}userIsOwner`;
      this.message = "User can't leave activity because they are the owner.";
    }
  },
  ActivityDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Leave.UC_CODE}activityDaoUpdateFailed`;
      this.message = "Update activity by activity DAO update failed.";
    }
  },
  DatetimeDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Leave.UC_CODE}datetimeDaoGetFailed`;
      this.message = "Get datetime by datetime DAO get failed.";
    }
  },
  DatetimeDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Leave.UC_CODE}datetimeDoesNotExist`;
      this.message = "Datetime with the provided id does not exist.";
    }
  },
  DatetimeDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Leave.UC_CODE}datetimeDaoUpdateFailed`;
      this.message = "Update datetime by datetime DAO update failed.";
    }
  },
};

const Delete = {
  UC_CODE: `${ERR_PREFIX}delete`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
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
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to delete this activity.";
    }
  },
  AttendanceDaoDeleteByActivityIdFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}attendanceDaoDeleteFailed`;
      this.message = "Delete attendances by attendance DAO deleteByActivityId failed.";
    }
  },
  PostDaoDeleteByActivityIdFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}postDaoDeleteByActivityIdFailed`;
      this.message = "Delete posts by post DAO deleteByActivityId failed.";
    }
  },
  InvitationDaoDeleteByActivityIdFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invitationDaoDeleteByActivityIdFailed`;
      this.message = "Delete invitations by invitation DAO deleteByActivityId failed.";
    }
  },
  DatetimeDaoDeleteByActivityIdFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}datetimeDaoDeleteByActivityIdFailed`;
      this.message = "Delete datetime by datetime DAO deleteByActivityId failed.";
    }
  },
  ActivityDaoDeleteFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}activityDaoDeleteFailed`;
      this.message = "Delete activity by activity DAO delete failed.";
    }
  },
};
