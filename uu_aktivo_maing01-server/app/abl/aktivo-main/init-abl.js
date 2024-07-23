"use strict";
const Crypto = require("crypto");
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { AuthenticationService } = require("uu_appg01_server").Authentication;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { UuDateTime } = require("uu_i18ng01");
const { ConsoleClient, ProgressClient } = require("uu_consoleg02-uulib");

const Errors = require("../../api/errors/aktivo-main-error");
const Warnings = require("../../api/warnings/aktivo-main-warning");
const Validator = require("../../components/validator");
const DtoBuilder = require("../../components/dto-builder");
const ScriptEngineClient = require("../../components/script-engine-client");
const AktivoMainClient = require("../../components/aktivo-main-client");
const StepHandler = require("../../components/step-handler");
const InitRollbackAbl = require("./init-rollback-abl");

const ConsoleConstants = require("../../constants/console-constants");
const ProgressConstants = require("../../constants/progress-constants");
const AktivoMainConstants = require("../../constants/aktivo-main-constants");
const Configuration = require("../../components/configuration");

const SCRIPT_CODE = "uu_aktivo_maing01-uuscriptlib/aktivo-main/init";

class InitAbl {
  constructor() {
    this.dao = DaoFactory.getDao(AktivoMainConstants.Schemas.AKTIVO_INSTANCE);
  }

  async init(uri, dtoIn) {
    // HDS 1
    const awid = uri.getAwid();
    this._validateDtoIn(uri, dtoIn);

    // HDS 2
    let uuAktivo = await this.dao.getByAwid(awid);
    let uuAppWorkspace = await UuAppWorkspace.get(awid);

    // HDS 3
    this._validateMode(uuAktivo, dtoIn, uuAppWorkspace.sysState);

    // HDS 4
    const configuration = await Configuration.getUuSubAppConfiguration({
      awid,
      artifactId: dtoIn.data.locationId || uuAktivo.temporaryData.dtoIn.locationId,
      uuTerritoryBaseUri: dtoIn.data.uuTerritoryBaseUri || uuAktivo.temporaryData.dtoIn.uuTerritoryBaseUri,
    });

    // HDS 5
    let initData;
    switch (dtoIn.mode) {
      case AktivoMainConstants.ModeMap.STANDARD: {
        initData = dtoIn.data;
        const uuTerritoryBaseUri = this._parseTerritoryUri(initData.uuTerritoryBaseUri);
        const temporaryData = {
          useCase: uri.getUseCase(),
          dtoIn: { ...initData },
          stepList: [AktivoMainConstants.InitStepMap.AKTIVO_OBJECT_CREATED.code],
          progressMap: {
            uuConsoleUri: configuration.uuConsoleBaseUri,
            progressCode: AktivoMainConstants.getInitProgressCode(awid),
            consoleCode: AktivoMainConstants.getMainConsoleCode(awid),
          },
        };

        uuAktivo = await this.dao.create({
          awid,
          state: AktivoMainConstants.StateMap.CREATED,
          code: `${AktivoMainConstants.AWSC_PREFIX}/${awid}`,
          uuTerritoryBaseUri: uuTerritoryBaseUri.toString(),
          artifactId: dtoIn.data.locationId,
          name: initData.name,
          desc: initData.desc,
          temporaryData,
        });

        try {
          await UuAppWorkspace.setBeingInitializedSysState(awid);
        } catch (e) {
          throw new Errors.Init.SetBeingInitializedSysStateFailed({}, e);
        }
        break;
      }

      case AktivoMainConstants.ModeMap.RETRY: {
        initData = uuAktivo.temporaryData.dtoIn;
        break;
      }

      case AktivoMainConstants.ModeMap.ROLLBACK: {
        uuAktivo.temporaryData.rollbackMode = true;
        if (!uuAktivo.temporaryData.rollbackStepList) {
          uuAktivo.temporaryData.rollbackStepList = [];
        }
        uuAktivo = await this.dao.updateByAwid({ ...uuAktivo });
        initData = uuAktivo.temporaryData.dtoIn;
        break;
      }

      default: {
        throw new Errors.Init.WrongModeAndCircumstances({
          mode: dtoIn.mode,
          appObjectState: uuAktivo?.state,
          temporaryData: uuAktivo?.temporaryData,
        });
      }
    }

    // HDS 6
    const sysIdentitySession = await AuthenticationService.authenticateSystemIdentity();
    const lockSecret = Crypto.randomBytes(32).toString("hex");
    const progressClient = await this._createInitProgress(
      uuAktivo,
      dtoIn,
      configuration,
      lockSecret,
      sysIdentitySession,
    );

    // HDS 7
    switch (dtoIn.mode) {
      case AktivoMainConstants.ModeMap.STANDARD:
      case AktivoMainConstants.ModeMap.RETRY: {
        const stepHandler = new StepHandler({
          schema: AktivoMainConstants.Schemas.AKTIVO_INSTANCE,
          progressClient,
          stepList: uuAktivo?.temporaryData?.stepList,
        });

        const aktivoMainClient = new AktivoMainClient(uuAktivo, uuAktivo.uuTerritoryBaseUri);

        uuAktivo = await stepHandler.handleStep(uuAktivo, AktivoMainConstants.InitStepMap.AWSC_CREATED, async () => {
          uuAktivo.state = AktivoMainConstants.StateMap.BEING_INITIALIZED;
          await this.dao.updateByAwid({ ...uuAktivo });
          await aktivoMainClient.createAwsc(
            initData.locationId,
            initData.responsibleRoleId,
            initData.permissionMatrix,
            configuration.uuAppMetaModelVersion,
          );
        });

        uuAktivo = await stepHandler.handleStep(uuAktivo, AktivoMainConstants.InitStepMap.WS_CONNECTED, async () => {
          await this._connectAwsc(uuAktivo, uri.getBaseUri(), uuAktivo.uuTerritoryBaseUri, sysIdentitySession);
        });

        uuAktivo = await stepHandler.handleStep(uuAktivo, AktivoMainConstants.InitStepMap.CONSOLE_CREATED, async () => {
          await this._createConsole(uuAktivo, configuration, sysIdentitySession);
        });

        // TODO If your application requires any additional steps, add them here...

        if (!uuAktivo.temporaryData.stepList.includes(AktivoMainConstants.InitStepMap.PROGRESS_ENDED.code)) {
          await this._runScript(uri.getBaseUri(), configuration, lockSecret, sysIdentitySession);
        } else {
          await this._initFinalize(uri, { lockSecret });
        }
        break;
      }

      case AktivoMainConstants.ModeMap.ROLLBACK: {
        if (
          uuAktivo.temporaryData.stepList.includes(AktivoMainConstants.InitStepMap.CONSOLE_CREATED.code) &&
          !uuAktivo.temporaryData.rollbackStepList.includes(AktivoMainConstants.InitRollbackStepMap.CONSOLE_CLEARED.code)
        ) {
          await InitRollbackAbl.initRollback(uri.getBaseUri(), configuration, lockSecret);
        } else {
          await InitRollbackAbl._initFinalizeRollback(uri, { lockSecret });
        }
        break;
      }

      default: {
        throw new Errors.Init.WrongModeAndCircumstances({
          mode: dtoIn.mode,
          appObjectState: uuAktivo?.state,
          temporaryData: uuAktivo?.temporaryData,
        });
      }
    }

    // HDS 8
    return DtoBuilder.prepareDtoOut({ data: uuAktivo });
  }

  async _initFinalize(uri, dtoIn) {
    // HDS 1
    const awid = uri.getAwid();
    Validator.validateDtoInCustom(uri, dtoIn, "sysUuAppWorkspaceInitFinalizeDtoInType");

    // HDS 2
    let uuAktivo = await this.dao.getByAwid(awid);

    if (!uuAktivo) {
      // 2.1
      throw new Errors._initFinalize.UuAktivoDoesNotExist({ awid });
    }

    if (![AktivoMainConstants.StateMap.BEING_INITIALIZED, AktivoMainConstants.StateMap.ACTIVE].includes(uuAktivo.state)) {
      // 2.2
      throw new Errors._initFinalize.NotInProperState({
        state: uuAktivo.state,
        expectedStateList: [AktivoMainConstants.StateMap.BEING_INITIALIZED, AktivoMainConstants.StateMap.ACTIVE],
      });
    }

    // HDS 3
    const sysIdentitySession = await AuthenticationService.authenticateSystemIdentity();
    const progress = {
      code: AktivoMainConstants.getInitProgressCode(uuAktivo.awid),
      lockSecret: dtoIn.lockSecret,
    };
    let progressClient = null;
    if (!uuAktivo.temporaryData.stepList.includes(AktivoMainConstants.InitStepMap.PROGRESS_ENDED.code)) {
      progressClient = await ProgressClient.get(uuAktivo.temporaryData.progressMap.uuConsoleUri, progress, {
        session: sysIdentitySession,
      });
    }
    const stepHandler = new StepHandler({
      schema: AktivoMainConstants.Schemas.AKTIVO_INSTANCE,
      progressClient,
      stepList: uuAktivo.temporaryData.stepList,
    });

    // TODO If your application requires any additional steps, add them here...

    // HDS 4
    uuAktivo = await stepHandler.handleStep(
      uuAktivo,
      AktivoMainConstants.InitStepMap.PROGRESS_ENDED,
      async () => {
        await progressClient.end({
          state: ProgressConstants.StateMap.COMPLETED,
          message: "Initialization finished.",
          doneWork: AktivoMainConstants.getInitStepCount(),
        });
      },
      false,
    );

    // HDS 5
    if (uuAktivo.state === AktivoMainConstants.StateMap.BEING_INITIALIZED) {
      uuAktivo = await this.dao.updateByAwid({ awid, state: AktivoMainConstants.StateMap.ACTIVE, temporaryData: null });
    }

    // HDS 6
    await UuAppWorkspace.setActiveSysState(awid);

    // HDS 7
    return DtoBuilder.prepareDtoOut({ data: uuAktivo });
  }

  // Validates dtoIn. In case of standard mode the data key of dtoIn is also validated.
  _validateDtoIn(uri, dtoIn) {
    let uuAppErrorMap = Validator.validateDtoIn(uri, dtoIn);
    if (dtoIn.mode === AktivoMainConstants.ModeMap.STANDARD) {
      Validator.validateDtoInCustom(uri, dtoIn.data, "sysUuAppWorkspaceInitStandardDtoInType", uuAppErrorMap);
    }
    return uuAppErrorMap;
  }

  _validateMode(uuAktivo, dtoIn, sysState) {
    switch (dtoIn.mode) {
      case AktivoMainConstants.ModeMap.STANDARD:
        if (![UuAppWorkspace.SYS_STATES.ASSIGNED, UuAppWorkspace.SYS_STATES.BEING_INITIALIZED].includes(sysState)) {
          // 3.A.1.1.
          throw new Errors.Init.SysUuAppWorkspaceIsNotInProperState({
            sysState,
            expectedSysStateList: [UuAppWorkspace.SYS_STATES.ASSIGNED, UuAppWorkspace.SYS_STATES.BEING_INITIALIZED],
          });
        }
        if (uuAktivo) {
          // 3.A.2.1.
          throw new Errors.Init.UuAktivoObjectAlreadyExist({
            mode: dtoIn.mode,
            allowedModeList: [AktivoMainConstants.ModeMap.RETRY, AktivoMainConstants.ModeMap.ROLLBACK],
          });
        }
        break;

      case AktivoMainConstants.ModeMap.RETRY:
        if (sysState !== UuAppWorkspace.SYS_STATES.BEING_INITIALIZED) {
          // 3.B.1.1.
          throw new Errors.Init.SysUuAppWorkspaceIsNotInProperState({
            sysState,
            expectedSysStateList: [UuAppWorkspace.SYS_STATES.BEING_INITIALIZED],
          });
        }
        if (!uuAktivo?.temporaryData) {
          // 3.B.2.1.
          throw new Errors.Init.MissingRequiredData();
        }
        if (uuAktivo?.temporaryData?.rollbackMode) {
          // 3.B.3.1.
          throw new Errors.Init.RollbackNotFinished();
        }
        break;

      case AktivoMainConstants.ModeMap.ROLLBACK:
        if (sysState !== UuAppWorkspace.SYS_STATES.BEING_INITIALIZED) {
          // 3.C.1.1.
          throw new Errors.Init.SysUuAppWorkspaceIsNotInProperState({
            sysState,
            expectedSysStateList: [UuAppWorkspace.SYS_STATES.BEING_INITIALIZED],
          });
        }
        if (!uuAktivo?.temporaryData) {
          // 3.C.2.1.
          throw new Errors.Init.MissingRequiredData();
        }
        if (!dtoIn.force && uuAktivo?.temporaryData?.rollbackMode) {
          // 3.C.3.1.
          throw new Errors.Init.RollbackAlreadyRunning();
        }
        break;
    }
  }

  _parseTerritoryUri(locationUri) {
    let uuTerritoryUri;

    try {
      uuTerritoryUri = UriBuilder.parse(locationUri).toUri();
    } catch (e) {
      throw new Errors.Init.UuTLocationUriParseFailed({ uri: locationUri }, e);
    }

    return uuTerritoryUri.getBaseUri();
  }

  async _createInitProgress(uuAktivo, dtoIn, config, lockSecret, session) {
    let progressClient;
    let progress = {
      expireAt: UuDateTime.now().shiftDay(7),
      name: AktivoMainConstants.getInitProgressName(uuAktivo.awid),
      code: AktivoMainConstants.getInitProgressCode(uuAktivo.awid),
      authorizationStrategy: "uuIdentityList",
      permissionMap: await this._getInitProgressPermissionMap(uuAktivo.awid, session),
      lockSecret,
    };

    try {
      progressClient = await ProgressClient.get(config.uuConsoleBaseUri, { code: progress.code }, { session });
    } catch (e) {
      if (e.cause?.code !== ProgressConstants.PROGRESS_DOES_NOT_EXIST) {
        throw new Errors.Init.ProgressGetCallFailed({ code: progress.code }, e);
      }
    }

    if (!progressClient) {
      try {
        progressClient = await ProgressClient.createInstance(config.uuConsoleBaseUri, progress, { session });
      } catch (e) {
        throw new Errors.Init.ProgressCreateCallFailed({ code: progress.code }, e);
      }
    } else if (dtoIn.force) {
      try {
        await progressClient.releaseLock();
      } catch (e) {
        if (e.cause?.code !== ProgressConstants.PROGRESS_RELEASE_DOES_NOT_EXIST) {
          throw new Errors.Init.ProgressReleaseLockCallFailed({ code: progress.code }, e);
        }
      }

      try {
        await progressClient.setState({ state: "cancelled" });
      } catch (e) {
        DtoBuilder.addWarning(new Warnings.Init.ProgressSetStateCallFailed(e.cause?.paramMap));
      }

      try {
        await progressClient.delete();
      } catch (e) {
        if (e.cause?.code !== ProgressConstants.PROGRESS_DELETE_DOES_NOT_EXIST) {
          throw new Errors.Init.ProgressDeleteCallFailed({ code: progress.code }, e);
        }
      }

      try {
        progressClient = await ProgressClient.createInstance(config.uuConsoleBaseUri, progress, { session });
      } catch (e) {
        throw new Errors.Init.ProgressCreateCallFailed({ code: progress.code }, e);
      }
    }

    try {
      await progressClient.start({
        message: "Progress was started",
        totalWork:
          dtoIn.mode === AktivoMainConstants.ModeMap.ROLLBACK
            ? AktivoMainConstants.getInitRollbackStepCount()
            : AktivoMainConstants.getInitStepCount(),
        lockSecret,
      });
    } catch (e) {
      throw new Errors.Init.ProgressStartCallFailed({ code: progress.code }, e);
    }

    return progressClient;
  }

  async _getInitProgressPermissionMap(awid, sysIdentitySession) {
    const awidData = await UuAppWorkspace.get(awid);

    let permissionMap = {};
    for (let identity of awidData.awidInitiatorList) {
      permissionMap[identity] = AktivoMainConstants.CONSOLE_BOUND_MATRIX.Authorities;
    }
    permissionMap[sysIdentitySession.getIdentity().getUuIdentity()] =
      AktivoMainConstants.CONSOLE_BOUND_MATRIX.Authorities;

    return permissionMap;
  }

  async _connectAwsc(uuAktivo, appUri, uuTerritoryBaseUri, session) {
    const artifactUri = UriBuilder.parse(uuTerritoryBaseUri).setParameter("id", uuAktivo.artifactId).toUri().toString();

    try {
      await UuAppWorkspace.connectArtifact(appUri, { artifactUri }, session);
    } catch (e) {
      throw new Errors.AktivoMain.ConnectAwscFailed(
        {
          awid: uuAktivo.awid,
          awscId: uuAktivo.artifactId,
          uuTerritoryBaseUri,
        },
        e,
      );
    }
  }

  async _createConsole(uuAktivo, configuration, session) {
    const artifactUri = UriBuilder.parse(uuAktivo.uuTerritoryBaseUri).setParameter("id", uuAktivo.artifactId).toString();
    const console = {
      code: AktivoMainConstants.getMainConsoleCode(uuAktivo.awid),
      authorizationStrategy: "boundArtifact",
      boundArtifactUri: artifactUri,
      boundArtifactPermissionMatrix: AktivoMainConstants.CONSOLE_BOUND_MATRIX,
    };

    try {
      await ConsoleClient.createInstance(configuration.uuConsoleBaseUri, console, { session });
    } catch (e) {
      throw new Errors.Init.FailedToCreateConsole({}, e);
    }
  }

  async _setConsoleExpiration(uuConsoleUri, consoleCode, session) {
    let consoleClient;
    try {
      consoleClient = await ConsoleClient.get(uuConsoleUri, { code: consoleCode }, { session });
    } catch (e) {
      if (e.cause?.code === ConsoleConstants.CONSOLE_GET_DOES_NOT_EXISTS) {
        throw new Errors._initFinalize.ConsoleGetCallFailed({ code: consoleCode }, e);
      }
    }

    try {
      await consoleClient.update({ expireAt: new UuDateTime().shiftDay(7).date });
    } catch (e) {
      if (e.cause?.code === ConsoleConstants.CONSOLE_UPDATE_DOES_NOT_EXISTS) {
        DtoBuilder.addWarning(new Warnings._initFinalize.ConsoleDoesNotExist({ code: consoleCode }));
      } else {
        throw new Errors._initFinalize.ConsoleUpdateCallFailed({ code: consoleCode }, e);
      }
    }
  }

  async _runScript(appUri, configuration, lockSecret, session) {
    const scriptEngineClient = new ScriptEngineClient({
      scriptEngineUri: configuration.uuScriptEngineBaseUri,
      consoleUri: configuration.uuConsoleBaseUri,
      consoleCode: AktivoMainConstants.getMainConsoleCode(appUri.getAwid()),
      scriptRepositoryUri: configuration.uuScriptRepositoryBaseUri,
      session,
    });

    const scriptDtoIn = {
      uuAktivoUri: appUri.toString(),
      lockSecret,
    };

    await scriptEngineClient.runScript({ scriptCode: SCRIPT_CODE, scriptDtoIn });
  }
}

module.exports = new InitAbl();
