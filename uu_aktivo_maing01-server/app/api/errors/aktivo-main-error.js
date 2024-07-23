"use strict";
const AktivoMainUseCaseError = require("./aktivo-main-use-case-error.js");

const Init = {
  UC_CODE: `${AktivoMainUseCaseError.ERROR_PREFIX}init/`,

  SysUuAppWorkspaceIsNotInProperState: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super(
        "sysUuAppWorkspaceIsNotInProperState",
        "SysUuAppWorkspace is not in proper state for init execution in chosen mode.",
        paramMap,
        cause,
      );
    }
  },

  UuAktivoObjectAlreadyExist: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super(
        "uuAktivoObjectAlreadyExist",
        "Standard mode cannot be executed if uuAktivo uuObject already exist. Choose retry or rollback mode instead.",
        paramMap,
        cause,
      );
    }
  },

  MissingRequiredData: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super(
        "missingRequiredData",
        "InitTemporaryData are missing, it is not possible to execute initialization in chosen mode.",
        paramMap,
        cause,
      );
    }
  },

  RollbackNotFinished: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super(
        "rollbackNotFinished",
        "It is not possible to retry initialization. Rollback already started and is in progress now.",
        paramMap,
        cause,
      );
    }
  },

  RollbackAlreadyRunning: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("rollbackAlreadyRunning", "Rollback is already running.", paramMap, cause);
    }
  },

  UuTLocationUriParseFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("uuTLocationUriParseFailed", "Parsing of uuTerritory location failed.", paramMap, cause);
    }
  },

  WrongModeAndCircumstances: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super(
        "wrongModeAndCircumstances",
        "Not possible to execute the cmd under current circumstances.",
        paramMap,
        cause,
      );
    }
  },

  SetBeingInitializedSysStateFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("setBeingInitializedSysStateFailed", "Failed to set beingInitialized sysState.", paramMap, cause);
    }
  },

  ProgressCreateCallFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("progressCreateCallFailed", "Failed to call progress/create uuCommand.", paramMap, cause);
    }
  },

  ProgressReleaseLockCallFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("progressReleaseLockCallFailed", "Failed to call progress/releaseLock uuCommand.", paramMap, cause);
    }
  },

  ProgressGetCallFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("progressGetCallFailed", "Failed to call progress/get uuCommand.", paramMap, cause);
    }
  },

  ProgressStartCallFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("progressStartCallFailed", "Failed to call progress/start uuCommand.", paramMap, cause);
    }
  },

  ProgressEndCallFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("progressEndCallFailed", "Failed to call progress/end uuCommand.", paramMap, cause);
    }
  },

  ProgressDeleteCallFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("progressDeleteCallFailed", "Failed to call progress/delete uuCommand.", paramMap, cause);
    }
  },

  FailedToCreateConsole: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("failedToCreateConsole", "Create console failed.", paramMap, cause);
    }
  },
};

const _initFinalize = {
  UC_CODE: `${AktivoMainUseCaseError.ERROR_PREFIX}_initFinalize/`,

  UuAktivoDoesNotExist: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("uuAktivoDoesNotExist", "uuAktivo does not exist", paramMap, cause);
    }
  },

  NotInProperState: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("uuAktivoIsNotInProperState", "uuAktivo is not in proper state", paramMap, cause);
    }
  },

  ConsoleGetCallFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("consoleGetCallFailed", "Failed to call console/get uuCommand.", paramMap, cause);
    }
  },

  ConsoleUpdateCallFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("consoleUpdateCallFailed", "Failed to call console/update uuCommand.", paramMap, cause);
    }
  },
};

const _initFinalizeRollback = {
  UC_CODE: `${AktivoMainUseCaseError.ERROR_PREFIX}_initFinalizeRollback/`,

  NotInProperState: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("uuAktivoIsNotInProperState", "uuAktivo is not in proper state", paramMap, cause);
    }
  },

  UuAktivoDoesNotExist: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("uuAktivoDoesNotExist", "uuAktivo does not exist", paramMap, cause);
    }
  },

  ConsoleGetCallFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("consoleGetCallFailed", "Failed to call console/get uuCommand.", paramMap, cause);
    }
  },

  ConsoleClearCallFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("consoleClearCallFailed", "Failed to call console/clear uuCommand.", paramMap, cause);
    }
  },

  SetAssignedSysStateFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("setAssignedSysStateFailed", "Failed to set assigned sysState.", paramMap, cause);
    }
  },

  ProgressEndCallFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("progressEndCallFailed", "Failed to call progress/end uuCommand.", paramMap, cause);
    }
  },

  ProgressSetStateCallFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("progressSetStateCallFailed", "Failed to call progress/setState uuCommand.", paramMap, cause);
    }
  },

  ProgressDeleteCallFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("progressDeleteCallFailed", "Failed to call progress/delete uuCommand.", paramMap, cause);
    }
  },
};

const Commence = {
  UC_CODE: `${AktivoMainUseCaseError.ERROR_PREFIX}commence/`,

  SchemaDaoCreateSchemaFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("schemaDaoCreateSchemaFailed", "Create schema by Dao createSchema failed.", paramMap, cause);
    }
  },
};

const AktivoMain = {
  CreateAwscFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("createAwscFailed", "Create uuAwsc failed.", paramMap, cause);
    }
  },

  ConnectAwscFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("connectAwscFailed", "Connect uuAwsc failed.", paramMap, cause);
    }
  },

  SetAwscStateFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("setAwscStateFailed", "Set uuAwsc state failed.", paramMap, cause);
    }
  },

  LoadAwscFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("loadAwscFailed", "Load of uuAwsc failed.", paramMap, cause);
    }
  },

  DeleteAwscFailed: class extends AktivoMainUseCaseError {
    constructor(paramMap = {}, cause = null) {
      super("deleteAwscFailed", "Delete uuAwsc failed.", paramMap, cause);
    }
  },
};

module.exports = {
  Init,
  _initFinalize,
  _initFinalizeRollback,
  Commence,
  AktivoMain,
};
