"use strict";
const AktivoMainUseCaseError = require("./aktivo-main-use-case-error.js");

const Init = {
  UC_CODE: `${AktivoMainUseCaseError.ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  SetProfileFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Set profile failed.";
    }
  },

  CreateAwscFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}createAwscFailed`;
      this.message = "Create uuAwsc failed.";
    }
  },
};

const SendEmailNotification = {
  UC_CODE: `${AktivoMainUseCaseError.ERROR_PREFIX}sendEmailNotification/`,
  InvalidDtoIn: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SendEmailNotification.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ActivityDaoGetFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SendEmailNotification.UC_CODE}activityDaoGetFailed`;
      this.message = "Get activity by activity DAO get failed.";
    }
  },
  ActivityDoesNotExist: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SendEmailNotification.UC_CODE}activityDoesNotExist`;
      this.message = "Activity with the provided id does not exist.";
    }
  },
  MissingResources: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SendEmailNotification.UC_CODE}missingResources`;
      this.message = "Required resources were not found.";
    }
  },
  NodemailerConnectionFailed: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SendEmailNotification.UC_CODE}nodemailerConnectionFailed`;
      this.message = "Nodemailer failed to connect.";
    }
  },
  NoReceiversProvided: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SendEmailNotification.UC_CODE}noReceiversProvided`;
      this.message = "No receiver emails were provided.";
    }
  },
  NodemailerError: class extends AktivoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SendEmailNotification.UC_CODE}nodemailerError`;
      this.message = "An error ocurred while sending email using nodemailer.";
    }
  },
};

module.exports = {
  Init,
  SendEmailNotification,
};
