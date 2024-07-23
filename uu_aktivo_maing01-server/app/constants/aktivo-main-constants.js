"use strict";

//@@viewOn:constants
const AktivoMainConstants = {
  AWSC_PREFIX: "uu-aktivo",
  CONSOLE_PREFIX: "aktivo",
  ERROR_PREFIX: "uu-aktivo-main",
  INIT_PROGRESS_CODE_PREFIX: "uu-aktivo-maing01-progress-init-",
  INIT_PROGRESS_NAME_PREFIX: "uuAktivo Init ",
  UUAPP_CODE: "uu-aktivo-maing01",

  CONFIG_CACHE_KEY: "configuration",
  UU_APP_ERROR_MAP: "uuAppErrorMap",

  // This is bound matrix of uuAwsc and uuConsole which has authorization bounded to that uuAwsc.
  CONSOLE_BOUND_MATRIX: {
    Authorities: ["Authorities", "Readers", "Writers"],
    Operatives: ["Readers", "Writers"],
    Auditors: ["Readers"],
    SystemIdentity: ["Authorities", "Readers", "Writers"],
  },

  InitStepMap: {
    AKTIVO_OBJECT_CREATED: { code: "uuAktivoObjectCreated", message: "The uuObject of uuAktivo created." },
    AWSC_CREATED: { code: "uuAwscCreated", message: "The uuAwsc of uuAktivo created." },
    WS_CONNECTED: { code: "uuAppWorkspaceConnected", message: "The uuAktivo uuAppWorkspace connected." },
    CONSOLE_CREATED: { code: "consoleCreated", message: "The console of uuAktivo created." },
    PROGRESS_ENDED: { code: "progressEnded", message: "The progress has been ended." },
    WS_ACTIVE: { code: "uuAppWorkspaceActiveState", message: "The uuAppWorkspace of uuAktivo set to active state." },
  },

  InitRollbackStepMap: {
    CONSOLE_CLEARED: { code: "consoleCleared", message: "The uuAktivo console has been cleared." },
    WS_DISCONNECTED: { code: "uuAppWorkspaceDisonnected", message: "The uuAktivo uuAppWorkspace disconnected." },
    AWSC_DELETED: { code: "uuAwscDeleted", message: "The uuAwsc of uuAktivo deleted." },
    PROGRESS_DELETED: { code: "progressDeleted", message: "The progress has been deleted." },
  },

  ModeMap: {
    STANDARD: "standard",
    RETRY: "retry",
    ROLLBACK: "rollback",
  },

  ProfileMask: {
    STANDARD_USER: parseInt("00010000000000000000000000000000", 2),
  },

  PropertyMap: {
    CONFIG: "config",
    SCRIPT_CONFIG: "scriptConfig",
    AKTIVO_CONFIG: "uuAktivoConfig",
  },

  Schemas: {
    AKTIVO_INSTANCE: "aktivoMain",
  },

  SharedResources: {
    SCRIPT_CONSOLE: "uu-console-maing02",
    SCRIPT_ENGINE: "uu-script-engineg02",
  },

  StateMap: {
    CREATED: "created",
    BEING_INITIALIZED: "beingInitialized",
    ACTIVE: "active",
    FINAL: "closed",
  },

  getMainConsoleCode: (awid) => {
    return `uu-aktivo-maing01-console-${awid}`;
  },

  getInitProgressCode: (awid) => {
    return `${AktivoMainConstants.INIT_PROGRESS_CODE_PREFIX}${awid}`;
  },

  getInitProgressName: (awid) => {
    return `${AktivoMainConstants.INIT_PROGRESS_NAME_PREFIX}${awid}`;
  },

  getInitStepCount: () => {
    return Object.keys(AktivoMainConstants.InitStepMap).length;
  },

  getInitRollbackStepCount: () => {
    return Object.keys(AktivoMainConstants.InitRollbackStepMap).length;
  },
};
//@@viewOff:constants

//@@viewOn:exports
module.exports = AktivoMainConstants;
//@@viewOff:exports
