const AppClient = require("uu_appg01_server").AppClient;
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UseCaseError } = require("uu_appg01_server").AppServer;

const dtoInSchema = `
  const recycleDatetimeDtoInType = shape({
    aktivoServerBaseUri: uri().isRequired(),
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
  DatetimeListFailed: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "UuCmd datetime/list failed.";
      this.code = `${Errors.ERROR_PREFIX}datetimeListFailed`;
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
      this.message = "UuCmd datetime/delete failed.";
      this.code = `${Errors.ERROR_PREFIX}datetimeDeleteFailed`;
    }
  },
};

function validateDtoIn(dtoInSchema) {
  const validator = new Validator(dtoInSchema);
  const validationResult = validator.validate("recycleDatetimeDtoInType", dtoIn);

  return ValidationHelper.processValidationResult(dtoIn, validationResult, `${Errors.ERROR_PREFIX}unsupportedKeys`, Errors.InvalidDtoIn);
}

async function loadDatetimeBatch(filters, batchIndex, batchSize) {
  const datetimeListDtoIn = {
    filters: filters,
    withActivity: true,
    pageInfo: {
      pageIndex: batchIndex,
      pageSize: batchSize,
    },
  };
  let datetimeListDtoOut;
  try {
    datetimeListDtoOut = await aktivoClient.cmdGet("datetime/list", datetimeListDtoIn);
  } catch (error) {
    throw new Errors.DatetimeListFailed(dtoOut, { baseUri: dtoIn.aktivoServerBaseUri }, error);
  }
  return datetimeListDtoOut;
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
  return;
}

async function processDatetime(datetime) {
  const { activity } = datetime;
  await createAttendance(datetime.id);
  if (activity.recurrent === true) {
    await createNextDatetime(datetime.id);
    console.info(`[Activity ${datetime.activityId}] Created next datetime`);
  } else {
    await deleteDatetime(datetime.id);
    console.info(`[Activity ${datetime.activityId}] Deleted datetime`);
  }
}

const { dtoIn, console, session } = scriptContext;
const dtoOut = {};
const INTERVAL = 10 * 60 * 1000;
let aktivoClient;

async function main() {
  const uuAppErrorMap = validateDtoIn(dtoInSchema);

  aktivoClient = new AppClient({ baseUri: dtoIn.baseUri, session });

  const dateNow = new Date();
  dateNow.setSeconds(0, 0);
  const loadDatetimeFilters = {
    datetime: [new Date(dateNow - INTERVAL).toISOString(), dateNow.toISOString()],
  };

  const BATCH_SIZE = 100;
  let batchIndex = 0;

  const datetimes = await loadDatetimeBatch(loadDatetimeFilters, batchIndex, BATCH_SIZE);

  if (datetimes.itemList.length === 0) {
    console.info("No datetimes to process - exiting");
    return;
  }

  const BATCH_INDEX_MAX = Math.floor(datetimes.pageInfo.total / BATCH_SIZE);
  console.info(`${BATCH_INDEX_MAX + 1} batches to process`);

  console.info(`Processing batch ${batchIndex + 1} of ${BATCH_INDEX_MAX + 1}`);

  await Promise.all(datetimes.itemList.map((datetime) => processDatetime(datetime)));

  batchIndex += 1;
  while (batchIndex <= BATCH_INDEX_MAX) {
    console.info(`Processing batch ${batchIndex + 1} of ${BATCH_INDEX_MAX + 1}`);

    const datetimeBatch = await loadDatetimeBatch(loadDatetimeFilters, batchIndex, BATCH_SIZE);

    await Promise.all(datetimeBatch.itemList.map((datetime) => processDatetime(datetime)));

    batchIndex += 1;
  }

  console.info("Finished processing batches");
  dtoOut.timeInterval = [loadDatetimeFilters.datetime];
  dtoOut.uuAppErrorMap = uuAppErrorMap;
  return dtoOut;
}

main();
