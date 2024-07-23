"use strict";
const AktivoMainUseCaseError = require("../errors/aktivo-main-use-case-error.js");

class AktivoMainUseCaseWarning {
  constructor(code, message, paramMap) {
    this.code = AktivoMainUseCaseError.generateCode(code);
    this.message = message;
    this.paramMap = paramMap instanceof Error ? undefined : paramMap;
  }
}

module.exports = AktivoMainUseCaseWarning;
