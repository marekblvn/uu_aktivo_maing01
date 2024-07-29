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
  AttendanceDaoCreateFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}attendanceDaoCreateFailed`;
      this.message = "Create attendance by attendance DAO create failed.";
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

module.exports = {
  Create,
  List,
  Delete,
};
