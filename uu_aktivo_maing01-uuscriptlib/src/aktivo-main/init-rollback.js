"use strict";

const { Uri } = require("uu_appg01_server").Uri;

// eslint-disable-next-line no-undef
scriptContext.dtoOut = { uuAppErrorMap: {} };
// eslint-disable-next-line no-undef
let { dtoIn, console, dtoOut, session } = scriptContext;

/*@@viewOn:imports*/
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UseCaseError } = require("uu_appg01_server").AppServer;
const { ProgressClient } = require("uu_consoleg02-uulib");

const AktivoMainClient = uuScriptRequire("uu_aktivo_maing01-uuscriptlib/aktivo-main-client", {
  scriptRequireCacheEnabled: false,
});
/*@@viewOff:imports*/

/*@@viewOn:names*/
const Names = {
  SCRIP_LIB_NAME: "uu_aktivo_maing01-uuscriptlib",
  SCRIPT_NAME: "AktivoMainInitRollback",
};
/*@@viewOff:names*/

/*@@viewOn:constants*/
const CMD_NAME = "init";
/*@@viewOff:constants*/

/*@@viewOn:errors*/
const Errors = {
  ERROR_PREFIX: `${Names.SCRIP_LIB_NAME}/${Names.SCRIPT_NAME}/`,

  InvalidDtoIn: class extends UseCaseError {
    constructor(dtoOut, paramMap, cause = null) {
      if (paramMap instanceof Error) {
        cause = paramMap;
        paramMap = {};
      }
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "DtoIn is not valid.";
      this.code = `${Errors.ERROR_PREFIX}invalidDtoIn`;
    }
  },
};
/*@@viewOff:errors*/

/*@@viewOn:scriptClient*/
class AktivoMainInitRollbackClient {
  constructor(lockSecret) {
    this.lockSecret = lockSecret;
    this.progressClient = null;
    this.aktivoMainClient = null;
    this.uuAktivo = null;
  }

  async start() {
    this.aktivoMainClient = new AktivoMainClient(dtoIn.uuAktivoUri);
    this.uuAktivo = await this.aktivoMainClient.load();
    this.progressClient = await ProgressClient.createInstance(
      this.uuAktivo.data.temporaryData.progressMap.uuConsoleUri,
      {
        code: this.uuAktivo.data.temporaryData.progressMap.progressCode,
        lockSecret: this.lockSecret,
      },
      { session }
    );

    return this.uuAktivo;
  }

  async initFinalizeRollback() {
    return this.aktivoMainClient.initFinalizeRollback(this.lockSecret);
  }
}
/*@@viewOff:scriptClient*/

/*@@viewOn:validateDtoIn*/
const DtoInValidationSchema = `const scriptAktivoMainInitRollbackDtoInType = shape({
  uuAktivoUri: string().isRequired(),
  lockSecret: hexa64Code().isRequired(),
})`;

function validateDtoIn(dtoIn, uuAppErrorMap = {}) {
  let dtoInValidator = new Validator(DtoInValidationSchema, true);
  let validationResult = dtoInValidator.validate("scriptAktivoMainInitRollbackDtoInType", dtoIn);
  return ValidationHelper.processValidationResult(dtoIn, validationResult, uuAppErrorMap, `${Errors.ERROR_PREFIX}unsupportedKeys`, Errors.InvalidDtoIn);
}
/*@@viewOff:validateDtoIn*/

/*@@viewOn:helpers*/
/*@@viewOff:helpers*/

async function main() {
  await console.info(`Script uuAktivo initRollback started`);
  dtoOut.dtoIn = dtoIn;
  const uuAppErrorMap = dtoOut.uuAppErrorMap;

  // validates dtoIn
  await console.info(`Validating dtoIn schema.`);
  await console.info(JSON.stringify(dtoIn));

  validateDtoIn(dtoIn, uuAppErrorMap);

  // initialization aktivoMain client and variables
  let mainContext = new AktivoMainInitRollbackClient(dtoIn.lockSecret);
  let uuAktivo = await mainContext.start();

  await console.log(`<uu5string/><UuConsole.Progress baseUri='${Uri.parse(scriptContext.scriptRuntime.getScriptConsoleUri()).baseUri}' progressCode='${mainContext.progressClient.progress.code}' />`);

  // TODO Add steps your application needs here...

  uuAktivo = await mainContext.initFinalizeRollback();

  return { data: uuAktivo, uuAppErrorMap };
}

main();
