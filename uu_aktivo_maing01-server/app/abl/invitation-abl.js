"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;

class InvitationAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "invitation-types.js"));
    this.invitationDao = DaoFactory.getDao("invitation");
    this.invitationDao.createSchema();
  }
}

module.exports = new InvitationAbl();
