const AppClient = require("uu_appg01_server").AppClient;
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UseCaseError } = require("uu_appg01_server").AppServer;

const dtoInSchema = `
  const recycleDatetimeDtoInSchemaType = shape({
    baseUri: uri().isRequired(),
    id: id().isRequired(),
  })
`;

const Errors = {
  ERROR_PREFIX: "uu-aktivo-scriptsg01/recycle-datetime/",
  InvalidDtoIn: class extends UseCaseError {
    constructor(dtoOut, paramMap) {
      super({ dtoOut, paramMap, status: 400 });
      this.message = "DtoIn is not valid.";
      this.code = `${Errors.ERROR_PREFIX}InvalidDtoIn`;
    }
  },
  DatetimeGetFailed: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "UuCmd datetime/get failed.";
      this.code = `${Errors.ERROR_PREFIX}datetimeGetFailed`;
    }
  },
  ActivityGetFailed: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "UuCmd activity/get failed.";
      this.code = `${Errors.ERROR_PREFIX}activityGetFailed`;
    }
  },
  AttendanceCreateFailed: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "UuCmd attendance/create failed.";
      this.code = `${Errors.ERROR_PREFIX}attendanceCreateFailed`;
    }
  },
  DatetimeCreateNextFailed: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "UuCmd datetime/createNext failed.";
      this.code = `${Errors.ERROR_PREFIX}datetimeCreateNextFailed`;
    }
  },
  DatetimeDeleteFailed: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      (this.message = "UuCmd datetime/delete failed."), (this.code = `${Errors.ERROR_PREFIX}datetimeDeleteFailed`);
    }
  },
};

function validateDtoIn(dtoInSchema) {
  const validator = new Validator(dtoInSchema);
  const validationResult = validator.validate("recycleDatetimeDtoInSchemaType", dtoIn);

  return ValidationHelper.processValidationResult(dtoIn, validationResult, `${Errors.ERROR_PREFIX}unsupportedKeys`, Errors.InvalidDtoIn);
}

async function getDatetime(datetimeId) {
  const datetimeGetDtoIn = {
    id: datetimeId,
  };
  let datetimeGetDtoOut;
  try {
    datetimeGetDtoOut = await aktivoClient.get("datetime/get", datetimeGetDtoIn);
  } catch (error) {
    throw new Errors.DatetimeGetFailed(dtoOut, { id: datetimeId }, error);
  }
  return datetimeGetDtoOut;
}

async function getActivity(activityId) {
  const activityGetDtoIn = {
    id: activityId,
  };
  let activityGetDtoOut;
  try {
    activityGetDtoOut = await aktivoClient.get("activity/get", activityGetDtoIn);
  } catch (error) {
    throw new Errors.ActivityGetFailed(dtoOut, { id: activityId }, error);
  }
  return activityGetDtoOut;
}

async function createAttendance(datetimeId) {
  const attendanceCreateDtoIn = {
    datetimeId: datetimeId,
  };
  let attendanceCreateDtoOut;
  try {
    attendanceCreateDtoOut = await aktivoClient.post("attendance/create", attendanceCreateDtoIn);
  } catch (error) {
    throw new Errors.AttendanceCreateFailed(dtoOut, { datetimeId }, error);
  }
  console.info(`Attendance created - ${attendanceCreateDtoOut}`);
  return attendanceCreateDtoOut;
}

async function createNextDatetime(datetimeId) {
  const datetimeCreateNextDtoIn = {
    id: datetimeId,
  };
  let datetimeCreateNextDtoOut;
  try {
    datetimeCreateNextDtoOut = await aktivoClient.post("datetime/createNext", datetimeCreateNextDtoIn);
  } catch (error) {
    throw new Errors.DatetimeCreateNextFailed(dtoOut, { id: datetimeId }, error);
  }
  console.info(`Next datetime created - ${datetimeCreateNextDtoOut}`);
  return datetimeCreateNextDtoOut;
}

async function deleteDatetime(datetimeId) {
  const datetimeDeleteDtoIn = {
    id: datetimeId,
  };
  try {
    await aktivoClient.post("datetime/delete", datetimeDeleteDtoIn);
  } catch (error) {
    throw new Errors.DatetimeDeleteFailed(dtoOut, { id: datetimeId }, error);
  }
  console.info(`Datetime ${datetimeId} deleted.`);
  return;
}

const { dtoIn, console, session } = scriptContext;
const dtoOut = {};
let aktivoClient;

async function main() {
  const uuAppErrorMap = validateDtoIn(dtoInSchema);

  aktivoClient = new AppClient({ baseUri: dtoIn.baseUri, session });

  // Getting datetime
  const datetime = await getDatetime(dtoIn.id);
  const { activityId } = datetime;

  // Getting activity
  const activity = await getActivity(activityId);
  const { recurrent } = activity;

  if (recurrent) {
    const attendance = await createAttendance(dtoIn.id);
    dtoOut.attendanceId = attendance.id;
    const nextDatetime = await createNextDatetime(dtoIn.id);
    dtoOut.nextDatetimeId = nextDatetime.id;
  } else {
    await deleteDatetime(dtoIn.id);
  }

  dtoOut.uuAppErrorMap = uuAppErrorMap;
  return dtoOut;
}

main();
