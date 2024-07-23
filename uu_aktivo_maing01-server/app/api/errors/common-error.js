"use strict";
const AktivoMainUseCaseError = require("./aktivo-main-use-case-error.js");

class InvalidDtoIn extends AktivoMainUseCaseError {
  constructor(dtoOut, paramMap = {}, cause = null) {
    super("invalidDtoIn", "DtoIn is not valid.", paramMap, cause, undefined, dtoOut);
  }
}

module.exports = {
  InvalidDtoIn,
};
