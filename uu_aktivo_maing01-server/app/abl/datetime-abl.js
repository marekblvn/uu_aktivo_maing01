"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;

class DatetimeAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "datetime-types.js"));
    this.datetimeDao = DaoFactory.getDao("datetime");
    this.datetimeDao.createSchema();
  }
}

module.exports = new DatetimeAbl();
