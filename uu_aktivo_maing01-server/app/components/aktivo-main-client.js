"use strict";
const { UseCaseContext } = require("uu_appg01_server").AppServer;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UuTerrClient } = require("uu_territory_clientg01");

const TerritoryConstants = require("../constants/territory-constants");
const DtoBuilder = require("./dto-builder");
const { AktivoMain: Errors } = require("../api/errors/aktivo-main-error");
const Warnings = require("../api/warnings/aktivo-main-warning");
const AktivoMainConstants = require("../constants/aktivo-main-constants");

class AktivoMainClient {
  constructor(uuAktivo, territoryUri = null, session = null) {
    this.dao = DaoFactory.getDao(AktivoMainConstants.Schemas.AKTIVO_INSTANCE);
    this.uuAktivo = uuAktivo;
    this.uri = UseCaseContext.getUri();
    this.territoryUri = territoryUri ? territoryUri : uuAktivo.uuTerritoryBaseUri;
    this.session = session ? session : UseCaseContext.getSession();
  }

  async createAwsc(location, responsibleRole, permissionMatrix, uuAppMetaModelVersion) {
    const appClientOpts = this.getAppClientOpts();
    const { name, desc } = this.uuAktivo;
    const awscCreateDtoIn = {
      name,
      desc,
      code: `${AktivoMainConstants.AWSC_PREFIX}/${this.uuAktivo.awid}`,
      location,
      responsibleRole,
      permissionMatrix,
      typeCode: AktivoMainConstants.UUAPP_CODE,
      uuAppWorkspaceUri: this.uri.getBaseUri(),
      uuAppMetaModelVersion,
    };

    let awsc;
    try {
      awsc = await UuTerrClient.Awsc.create(awscCreateDtoIn, appClientOpts);
    } catch (e) {
      const awscCreateErrorMap = (e.dtoOut && e.dtoOut.uuAppErrorMap) || {};

      const isDup =
        awscCreateErrorMap[TerritoryConstants.AWSC_CREATE_FAILED_CODE] &&
        awscCreateErrorMap[TerritoryConstants.AWSC_CREATE_FAILED_CODE].cause &&
        awscCreateErrorMap[TerritoryConstants.AWSC_CREATE_FAILED_CODE].cause[TerritoryConstants.NOT_UNIQUE_ID_CODE];

      if (isDup) {
        DtoBuilder.addWarning(new Warnings.Init.UuAwscAlreadyCreated());
        awsc = await UuTerrClient.Awsc.get(
          { code: `${AktivoMainConstants.AWSC_PREFIX}/${this.uuAktivo.awid}` },
          appClientOpts,
        );
      } else {
        DtoBuilder.addUuAppErrorMap(awscCreateErrorMap);
        throw new Errors.CreateAwscFailed(
          { uuTerritoryBaseUri: this.uuAktivo.uuTerritoryBaseUri, awid: this.uuAktivo.awid },
          e,
        );
      }
    }

    this.uuAktivo = await this.dao.updateByAwid({
      awid: this.uuAktivo.awid,
      artifactId: awsc.id,
    });

    return this.uuAktivo;
  }

  async loadAwsc() {
    const appClientOpts = this.getAppClientOpts();

    let awsc;
    try {
      awsc = await UuTerrClient.Awsc.load({ id: this.uuAktivo.artifactId }, appClientOpts);
    } catch (e) {
      throw new Errors.LoadAwscFailed({ artifactId: this.uuAktivo.artifactId }, e);
    }

    return awsc;
  }

  async setAwscState(state) {
    const appClientOpts = this.getAppClientOpts();
    try {
      await UuTerrClient.Awsc.setState(
        {
          id: this.uuAktivo.artifactId,
          state,
        },
        appClientOpts,
      );
    } catch (e) {
      throw new Errors.SetAwscStateFailed({ state, id: this.uuAktivo.artifactId }, e);
    }
  }

  getAppClientOpts() {
    return { baseUri: this.territoryUri, session: this.session, appUri: this.uri };
  }
}

module.exports = AktivoMainClient;
