"use strict";
const AktivoMainUseCaseError = require("./aktivo-main-use-case-error");

const ERR_PREFIX = `${AktivoMainUseCaseError.ERROR_PREFIX}datetime/`;

const Create = {
  UC_CODE: `${ERR_PREFIX}create/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  FrequencyIsRequired: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}frequencyIsRequired`;
      this.message = "Frequency is required for recurrent activity.";
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
  DatetimeAlreadyExists: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}datetimeAlreadyExists`;
      this.message = "The activity already has a datetime.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to create datetime in this activity.";
    }
  },
  InvalidDatetime: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDatetime`;
      this.message = "Provided datetime is not valid. Datetime must not be sooner than 12 hours from now.";
    }
  },
  InvalidNotificationOffset: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidNotificationOffset`;
      this.message = "Provided notification offset it not valid. Notification offset must be at least an hour.";
    }
  },
  NotificationDateIsInPast: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}notificationDateIsInPast`;
      this.message = "Notification offset is too high. The first notification date would be in the past from now.";
    }
  },
  InvalidFrequencyAndNotificationOffset: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidFrequencyAndNotificationOffset`;
      this.message = "Invalid combination of frequency and notification offset.";
    }
  },
  DatetimeDaoCreateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}datetimeDaoCreateFailed`;
      this.message = "Create datetime by datetime DAO create failed.";
    }
  },
  ActivityDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}activityDaoUpdateFailed`;
      this.message = "Update activity by activity DAO update failed.";
    }
  },
};

const CreateNext = {
  UC_CODE: `${ERR_PREFIX}createNext/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CreateNext.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  DatetimeDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CreateNext.UC_CODE}datetimeDaoGetFailed`;
      this.message = "Get datetime by datetime DAO get failed.";
    }
  },
  DatetimeDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CreateNext.UC_CODE}datetimeDoesNotExist`;
      this.message = "Datetime with provided id does not exist.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CreateNext.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CreateNext.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with provided id does not exist.";
    }
  },
  ActivityNotRecurrent: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CreateNext.UC_CODE}activityNotRecurrent`;
      this.message = "Activity is not recurrent. Next datetime cannot be created.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CreateNext.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to create next datetime.";
    }
  },
  DatetimeDaoDeleteFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CreateNext.UC_CODE}datetimeDaoDeleteFailed`;
      this.message = "Delete datetime by datetime DAO delete failed.";
    }
  },
  DatetimeDaoCreateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CreateNext.UC_CODE}datetimeDaoCreateFailed`;
      this.message = "Create datetime by datetime DAO create failed.";
    }
  },
  ActivityDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CreateNext.UC_CODE}activityDaoUpdateFailed`;
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
  DatetimeDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}datetimeDaoGetFailed`;
      this.message = "Get datetime by datetime DAO get failed.";
    }
  },
  DatetimeDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}datetimeDoesNotExist`;
      this.message = "Activity with provided id does not exist.";
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
      this.message = "User is not authorized to access datetime of this activity.";
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
  DatetimeDaoListFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}datetimeDaoListFailed`;
      this.message = "List datetimes by datetime DAO list failed.";
    }
  },
  DatetimeDaoListWithActivityFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}datetimeDaoListWithActivityFailed`;
      this.message = "List datetimes with activity by datetime DAO listWithActivity failed.";
    }
  },
};

const UpdateParticipation = {
  UC_CODE: `${ERR_PREFIX}updateParticipation/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateParticipation.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  DatetimeDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateParticipation.UC_CODE}datetimeDaoGetFailed`;
      this.message = "Get datetime by datetime DAO get failed.";
    }
  },
  DatetimeDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateParticipation.UC_CODE}datetimeDoesNotExist`;
      this.message = "Datetime with provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateParticipation.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to update their participation on this datetime.";
    }
  },
  DatetimeHasPassed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateParticipation.UC_CODE}datetimeHasPassed`;
      this.message = "The datetime has passed and the participation can not be updated anymore.";
    }
  },
  DatetimeDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateParticipation.UC_CODE}datetimeDaoUpdateFailed`;
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
  DatetimeDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}datetimeDaoGetFailed`;
      this.message = "Get datetime by datetime DAO get failed.";
    }
  },
  DatetimeDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}datetimeDoesNotExist`;
      this.message = "Datetime with provided id does not exist.";
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
      this.message = "User is not authorized to create datetime in this activity.";
    }
  },
  AttendanceDaoDeleteByActivityIdFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}AttendanceDaoDeleteByActivityIdFailed`;
      this.message = "Delete attendances by attendance DAO deleteByActivityId failed.";
    }
  },
  DatetimeDaoDeleteFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}datetimeDaoDeleteFailed`;
      this.message = "Delete datetime by datetime DAO delete failed.";
    }
  },
  ActivityDaoUpdateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}activityDaoUpdateFailed`;
      this.message = "Update activity by activity DAO update failed.";
    }
  },
};

module.exports = {
  Create,
  CreateNext,
  Get,
  List,
  UpdateParticipation,
  Delete,
};
