"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/datetime-error");

const UnsupportedKeysWarning = (error) => `${error?.UC_CODE}unsupportedKeysWarning`;

const PROFILE_CODES = {
  Authorities: "Authorities",
  Executives: "Executives",
  StandardUsers: "StandardUsers",
};

class DatetimeAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "datetime-types.js"));
    this.datetimeDao = DaoFactory.getDao("datetime");
    this.datetimeDao.createSchema();
    this.activityDao = DaoFactory.getDao("activity");
  }
}

module.exports = new DatetimeAbl();
