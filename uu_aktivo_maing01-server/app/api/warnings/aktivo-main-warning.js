"use strict";
const AktivoMainUseCaseWarning = require("./aktivo-main-use-case-warning.js");

const Warnings = {
  Init: {
    UuAwscAlreadyCreated: class extends AktivoMainUseCaseWarning {
      constructor(paramMap) {
        super("uuAwscAlreadyCreated", "Step uuAwscCreated skipped, uuAwsc already exists.", paramMap);
      }
    },
    ProgressSetStateCallFailed: class extends AktivoMainUseCaseWarning {
      constructor(paramMap = {}, cause = null) {
        super("progressSetStateCallFailed", "Failed to call progress/setState uuCommand.", paramMap);
      }
    },
  },

  _initFinalize: {
    ConsoleDoesNotExist: class extends AktivoMainUseCaseWarning {
      constructor(paramMap) {
        super("consoleDoesNotExist", "Console does not exist.", paramMap);
      }
    },
  },

  _initFinalizeRollback: {
    ConsoleDoesNotExist: class extends AktivoMainUseCaseWarning {
      constructor(paramMap) {
        super("consoleDoesNotExist", "Console does not exist.", paramMap);
      }
    },

    UuAwscDoesNotExist: class extends AktivoMainUseCaseWarning {
      constructor(paramMap) {
        super("uuAwscDoesNotExist", "uuAwsc does not exist.", paramMap);
      }
    },
  },
};

module.exports = Warnings;
