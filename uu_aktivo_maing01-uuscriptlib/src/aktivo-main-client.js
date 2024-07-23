const AppClient = require("uu_appg01_server").AppClient;
const { UseCaseError } = require("uu_appg01_server").AppServer;

const { session, dtoOut } = scriptContext;

/*@@viewOn:names*/
const Names = {
  SCRIPT_LIB_NAME: "uu_aktivo_maing01-uuscriptlib",
  CLASS_NAME: "AktivoMainClient",
};
/*@@viewOff:names*/

/*@@viewOn:errors*/
const Errors = {
  ERROR_PREFIX: `${Names.SCRIPT_LIB_NAME}/${Names.CLASS_NAME}/`,

  LoadUuAktivoFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/load failed.";
      this.code = `${Errors.ERROR_PREFIX}loadUuAktivoFailed`;
    }
  },

  GetUuAktivoFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/get failed.";
      this.code = `${Errors.ERROR_PREFIX}getUuAktivoFailed`;
    }
  },

  InitFinalizeFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/_initFinalize failed.";
      this.code = `${Errors.ERROR_PREFIX}initFinalizeFailed`;
    }
  },

  InitFinalizeRollbackFailed: class extends UseCaseError {
    constructor(paramMap, cause) {
      super({ dtoOut, paramMap, status: 400 }, cause);
      this.message = "Calling sys/uuAppWorkspace/_initFinalizeRollback failed.";
      this.code = `${Errors.ERROR_PREFIX}initFinalizeRollbackFailed`;
    }
  },
};

/*@@viewOff:errors*/

class AktivoMainClient {
  constructor(baseUri) {
    this.appClient = new AppClient({ baseUri, session });
    // base uri can be used as parameter in error
    this.baseUri = baseUri;
  }

  async load() {
    let aktivo;
    try {
      aktivo = await this.appClient.cmdGet("sys/uuAppWorkspace/load");
    } catch (e) {
      throw new Errors.LoadUuAktivoFailed({ baseUri: this.baseUri }, e);
    }
    return aktivo;
  }

  async get() {
    let aktivo;
    try {
      aktivo = await this.appClient.cmdGet("sys/uuAppWorkspace/get");
    } catch (e) {
      throw new Errors.GetUuAktivoFailed({ baseUri: this.baseUri }, e);
    }
    return aktivo;
  }

  async initFinalize(lockSecret) {
    let aktivo;
    try {
      aktivo = await this.appClient.cmdPost("sys/uuAppWorkspace/_initFinalize", { lockSecret });
    } catch (e) {
      throw new Errors.InitFinalizeFailed({ baseUri: this.baseUri }, e);
    }
    return aktivo;
  }

  async initFinalizeRollback(lockSecret) {
    let aktivo;
    try {
      aktivo = await this.appClient.cmdPost("sys/uuAppWorkspace/_initFinalizeRollback", { lockSecret });
    } catch (e) {
      throw new Errors.InitFinalizeRollbackFailed({ baseUri: this.baseUri }, e);
    }
    return aktivo;
  }
}

module.exports = AktivoMainClient;
