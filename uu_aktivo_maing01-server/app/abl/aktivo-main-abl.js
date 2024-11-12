"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, AppClientTokenService, UuAppWorkspace, UuAppWorkspaceError, UuAppSecretStore } =
  require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const { AppClient } = require("uu_appg01_server");
const Errors = require("../api/errors/aktivo-main-error.js");
const InstanceChecker = require("../api/components/instance-checker.js");

const UnsupportedKeysWarning = (error) => `${error?.UC_CODE}unsupportedKeys`;

const logger = LoggerFactory.get("AktivoMainAbl");

class AktivoMainAbl {
  constructor() {
    this.validator = Validator.load();
  }

  async init(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // HDS 1
    let validationResult = this.validator.validate("initDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.Init),
      Errors.Init.InvalidDtoIn,
    );

    // HDS 2
    const schemas = ["aktivoMain", "activity", "datetime", "attendance", "post", "invitation"];
    let schemaCreateResults = schemas.map(async (schema) => {
      try {
        return await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        // A3
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    });
    await Promise.all(schemaCreateResults);

    if (dtoIn.uuBtLocationUri) {
      const baseUri = uri.getBaseUri();
      const uuBtUriBuilder = UriBuilder.parse(dtoIn.uuBtLocationUri);
      const location = uuBtUriBuilder.getParameters().id;
      const uuBtBaseUri = uuBtUriBuilder.toUri().getBaseUri();

      const createAwscDtoIn = {
        name: "UuAktivo",
        typeCode: "uu-aktivo-maing01",
        location: location,
        uuAppWorkspaceUri: baseUri,
      };

      const awscCreateUri = uuBtUriBuilder.setUseCase("uuAwsc/create").toUri();
      const appClientToken = await AppClientTokenService.createToken(uri, uuBtBaseUri);
      const callOpts = AppClientTokenService.setToken({ session }, appClientToken);

      // TODO HDS
      let awscId;
      try {
        const awscDtoOut = await AppClient.post(awscCreateUri, createAwscDtoIn, callOpts);
        awscId = awscDtoOut.id;
      } catch (e) {
        if (e.code.includes("applicationIsAlreadyConnected") && e.paramMap.id) {
          logger.warn(`Awsc already exists id=${e.paramMap.id}.`, e);
          awscId = e.paramMap.id;
        } else {
          throw new Errors.Init.CreateAwscFailed({ uuAppErrorMap }, { location: dtoIn.uuBtLocationUri }, e);
        }
      }

      const artifactUri = uuBtUriBuilder.setUseCase(null).clearParameters().setParameter("id", awscId).toUri();

      await UuAppWorkspace.connectArtifact(
        baseUri,
        {
          artifactUri: artifactUri.toString(),
          synchronizeArtifactBasicAttributes: false,
        },
        session,
      );
    }

    // HDS 3
    if (dtoIn.uuAppProfileAuthorities) {
      try {
        await Profile.set(awid, "Authorities", dtoIn.uuAppProfileAuthorities);
      } catch (e) {
        if (e instanceof UuAppWorkspaceError) {
          // A4
          throw new Errors.Init.SetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
        }
        throw e;
      }
    }

    // HDS 4 - HDS N
    if (dtoIn.secrets?.nodemailer) {
      dtoIn.secrets.nodemailer.port = dtoIn.secrets.nodemailer.port.toString();
      const nodemailerSet = "nodemailer";
      await Promise.all(
        Object.entries(dtoIn.secrets.nodemailer).map(([key, value]) =>
          UuAppSecretStore.putSecret(awid, nodemailerSet, key, value.toString()),
        ),
      );
    }

    // HDS N+1
    const workspace = UuAppWorkspace.get(awid);

    return {
      ...workspace,
      uuAppErrorMap: uuAppErrorMap,
    };
  }

  async load(uri, session, uuAppErrorMap = {}) {
    // HDS 1
    const dtoOut = await UuAppWorkspace.load(uri, session, uuAppErrorMap);

    // TODO Implement according to application needs...
    // if (dtoOut.sysData.awidData.sysState !== UuAppWorkspace.SYS_STATES.CREATED &&
    //    dtoOut.sysData.awidData.sysState !== UuAppWorkspace.SYS_STATES.ASSIGNED
    // ) {
    //   const awid = uri.getAwid();
    //   const appData = await this.dao.get(awid);
    //   dtoOut.data = { ...appData, relatedObjectsMap: {} };
    // }

    // HDS 2
    return dtoOut;
  }

  async loadBasicData(uri, session, uuAppErrorMap = {}) {
    // HDS 1
    const dtoOut = await UuAppWorkspace.loadBasicData(uri, session, uuAppErrorMap);

    // TODO Implement according to application needs...
    // const awid = uri.getAwid();
    // const workspace = await UuAppWorkspace.get(awid);
    // if (workspace.sysState !== UuAppWorkspace.SYS_STATES.CREATED &&
    //    workspace.sysState !== UuAppWorkspace.SYS_STATES.ASSIGNED
    // ) {
    //   const appData = await this.dao.get(awid);
    //   dtoOut.data = { ...appData, relatedObjectsMap: {} };
    // }

    // HDS 2
    return dtoOut;
  }
  async getAuthorizedProfiles(authorizationResult) {
    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const dtoOut = { authorizedProfiles };
    return dtoOut;
  }

  async sendEmailNotification(awid, dtoIn, authorizationResult) {
    let validationResult = this.validator.validate("sendEmailNotificationDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      UnsupportedKeysWarning(Errors.SendEmailNotification),
      Errors.SendEmailNotification.InvalidDtoIn,
    );

    await InstanceChecker.ensureInstanceAndState(
      awid,
      Errors.SendEmailNotification,
      uuAppErrorMap,
      authorizationResult,
      {
        Authorities: ["active", "restricted"],
      },
    );

    const nodemailerSecretSet = "nodemailer";

    const host = await UuAppSecretStore.getSecret(awid, nodemailerSecretSet, "host");
    const port = await UuAppSecretStore.getSecret(awid, nodemailerSecretSet, "port");
    const user = await UuAppSecretStore.getSecret(awid, nodemailerSecretSet, "user");
    const pass = await UuAppSecretStore.getSecret(awid, nodemailerSecretSet, "pass");

    Object.entries({ host, port, user, pass }).forEach(([key, val]) => {
      if (val == null) {
        throw new Errors.SendEmailNotification.MissingResources({ uuAppErrorMap }, { resource: key });
      }
    });

    const nodemailer = require("nodemailer");
    const TRANSPORTER = nodemailer.createTransport({
      host,
      port: parseInt(port),
      auth: {
        user,
        pass,
      },
    });

    TRANSPORTER.verify((error, _) => {
      if (error) {
        throw new Errors.SendEmailNotification.NodemailerConnectionFailed({ uuAppErrorMap });
      }
    });

    const { activityId, activityName, receiverEmailList, emailHtmlContent, emailTextContent } = dtoIn;

    if (receiverEmailList.length === 0) {
      throw new Errors.SendEmailNotification.NoReceiversProvided({ uuAppErrorMap }, { activityId });
    }

    let content;
    if (emailHtmlContent) {
      content = { html: emailHtmlContent };
    } else {
      content = { text: emailTextContent };
    }

    let dtoOut;
    try {
      dtoOut = await TRANSPORTER.sendMail({
        from: '"Aktivo"<noreply@aktivoapp.online>',
        to: receiverEmailList.join(","),
        subject: activityName,
        ...content,
      });
    } catch (error) {
      throw new Errors.SendEmailNotification.NodemailerError({ uuAppErrorMap }, error);
    }

    delete dtoOut.ehlo;
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new AktivoMainAbl();
