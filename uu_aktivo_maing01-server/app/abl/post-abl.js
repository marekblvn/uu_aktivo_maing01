"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;

class PostAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_type", "post-types.js"));
    this.postDao = DaoFactory.getDao("post");
    this.postDao.createSchema();
  }
}

module.exports = new PostAbl();
