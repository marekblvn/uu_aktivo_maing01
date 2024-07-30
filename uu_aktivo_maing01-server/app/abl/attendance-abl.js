"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;

class AttendanceAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation-types", "attendance-types.js"));
    this.attendanceDao = DaoFactory.getDao("attendance");
    this.attendanceDao.createSchema();
  }
}

module.exports = new AttendanceAbl();
