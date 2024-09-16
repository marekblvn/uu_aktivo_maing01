"use strict";

const AktivoMainUseCaseError = require("../errors/aktivo-main-use-case-error");

const { UuAppWorkspace } = require("uu_appg01_server").Workspace;

class InstanceChecker {
  /**
   * Ensures that the user with their authorized profiles can access the functionality in the current sysState. Allowed states are defined by allowedStateRules.
   * @param {string} awid
   * @param {object} errors error class,
   * @param {object} uuAppErrorMap error map to output errors to,
   * @param {object} authorizationResult authorization result as received from ucEnv
   * @param {Object.<string,[string]>} allowedStateRules e.g. {"Authorities": ["active"]}
   * @return {Promise<void>}
   */
  async ensureInstanceAndState(awid, errors, uuAppErrorMap, authorizationResult, allowedStateRules) {
    const Errors = {
      CODE: `${errors.UC_CODE}`,
      WorkspaceDoesNotExist: class extends AktivoMainUseCaseError {
        constructor() {
          super(...arguments);
          this.code = `${Errors.CODE}workspaceDoesNotExist`;
          this.message = "uuAppWorkspace wth provided awid does not exist.";
        }
      },
      WorkspaceNotInCorrectState: class extends AktivoMainUseCaseError {
        constructor() {
          super(...arguments);
          this.code = `${Errors.CODE}workspaceNotInCorrectState`;
          this.message = "uuAppWorkspace is not in correct state.";
        }
      },
    };

    const workspace = await UuAppWorkspace.get(awid);
    if (!workspace) {
      throw new Errors.WorkspaceDoesNotExist({ uuAppErrorMap }, { awid });
    }

    const sysState = workspace.sysState;
    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const highestProfile = authorizedProfiles[0];
    const allowedStates = allowedStateRules[highestProfile] || [];

    if (!allowedStates.includes(sysState)) {
      throw new Errors.WorkspaceNotInCorrectState(
        { uuAppErrorMap },
        { awid, state: sysState, expectedStates: allowedStateRules[highestProfile] },
      );
    }
  }
}

module.exports = new InstanceChecker();
