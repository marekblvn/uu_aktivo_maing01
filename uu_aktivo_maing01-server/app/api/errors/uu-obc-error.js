"use strict";
const AktivoMainUseCaseError = require("./aktivo-main-use-case-error.js");

class UuObcCreateFailed extends AktivoMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("uuObcCreateFailed", "Failed to create uuObc.", paramMap, cause);
  }
}

class UuObcLoadFailed extends AktivoMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("uuObcLoadFailed", "Failed to load uuObc.", paramMap, cause);
  }
}

class UuArtifactIfcLoadDataFailed extends AktivoMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("uuArtifactIfcLoadDataFailed", "Failed to call uuArtifactIfc/loadLoad.", paramMap, cause);
  }
}

class UuObcSetStateFailed extends AktivoMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("uuObcSetStateFailed", "The uuObc set state failed.", paramMap, cause);
  }
}

class UuObcSetBasicAttributesFailed extends AktivoMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("uuObcSetBasicAttributesFailed", "The uuObc set basic attributes failed.", paramMap, cause);
  }
}

class UuObcDeleteFailed extends AktivoMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("uuObcDeleteFailed", "The uuObc delete failed", paramMap, cause);
  }
}

class UuObcMoveToTrashFailed extends AktivoMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("uuObcMoveToTrashFailed", "The uuObc move to trash failed.", paramMap, cause);
  }
}

class UuObcRestoreFromTrashFailed extends AktivoMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("uuObcRestoreFromTrashFailed", "The uuObc restore from trash.", paramMap, cause);
  }
}

module.exports = {
  UuObcCreateFailed,
  UuObcLoadFailed,
  UuObcSetStateFailed,
  UuObcSetBasicAttributesFailed,
  UuObcDeleteFailed,
  UuObcMoveToTrashFailed,
  UuObcRestoreFromTrashFailed,
  UuArtifactIfcLoadDataFailed,
};
