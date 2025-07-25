"use strict";
const AktivoMainUseCaseError = require("./aktivo-main-use-case-error");

const ERR_PREFIX = `${AktivoMainUseCaseError.ERROR_PREFIX}attendance/`;

const Create = {
  UC_CODE: `${ERR_PREFIX}create/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  DatetimeDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}datetimeDaoGetFailed`;
      this.message = "Get datetime by datetime DAO get failed.";
    }
  },
  DatetimeDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}datetimeDoesNotExist`;
      this.message = "Datetime with provided id does not exist.";
    }
  },
  DatetimeStillActive: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}datetimeStillActive`;
      this.message = "Datetime is still active.";
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
  AttendanceDaoCreateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}attendanceDaoCreateFailed`;
      this.message = "Create attendance by attendance DAO create failed.";
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
      this.message = "Activity associated with this attendance does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to access attendance of this activity.";
    }
  },
  AttendanceDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}attendanceDaoGetFailed`;
      this.message = "Get attendance by attendance DAO get failed.";
    }
  },
  AttendanceDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}attendanceDoesNotExist`;
      this.message = "Attendance with provided id does not exist.";
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
      this.message = "User is not authorized to list all attendances.";
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
  AttendanceDaoListByActivityIdFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}attendanceDaoListByActivityIdFailed`;
      this.message = "List attendances by attendance DAO listByActivityId failed.";
    }
  },
  AttendanceDaoListFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}attendanceDaoListFailed`;
      this.message = "List attendances by attendance DAO list failed.";
    }
  },
};

const GetStatistics = {
  UC_CODE: `${ERR_PREFIX}getStatistics/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetStatistics.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetStatistics.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to list all attendances.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetStatistics.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetStatistics.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with provided id does not exist.";
    }
  },
  UserNotMember: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetStatistics.UC_CODE}userNotMember`;
      this.message = "User is not a member of this activity.";
    }
  },
  AttendanceDaoGetStatisticsFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetStatistics.UC_CODE}attendanceDaoGetStatisticsFailed`;
      this.message = "Get attendance statistics by attendance DAO getStatistics failed.";
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
  AttendanceDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}attendanceDaoGetFailed`;
      this.message = "Get attendance by attendance DAO get failed.";
    }
  },
  AttendanceDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}attendanceDoesNotExist`;
      this.message = "Attendance with provided id does not exist.";
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
      this.message = "User is not authorized to delete attendance in this activity.";
    }
  },
  AttendanceDaoDeleteFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}attendanceDaoDeleteFailed`;
      this.message = "Delete attendance by attendance DAO delete failed.";
    }
  },
};

const DeleteBulk = {
  UC_CODE: `${ERR_PREFIX}deleteBulk/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteBulk.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  AttendanceDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteBulk.UC_CODE}attendanceDaoGetFailed`;
      this.message = "Get attendance by attendance DAO get failed.";
    }
  },
  AttendanceDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteBulk.UC_CODE}attendanceDoesNotExist`;
      this.message = "Attendance with provided id does not exist.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteBulk.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteBulk.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with provided id does not exist.";
    }
  },
  UserNotAuthorized: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteBulk.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized to delete attendance in this activity.";
    }
  },
  AttendanceDaoDeleteByIdListFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${DeleteBulk.UC_CODE}attendanceDaoDeleteByIdListFailed`;
      this.message = "Delete attendances by attendance DAO deleteByIdList failed.";
    }
  },
};

module.exports = {
  Create,
  Get,
  List,
  GetStatistics,
  Delete,
  DeleteBulk,
};
