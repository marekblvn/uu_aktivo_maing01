"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class DatetimeMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, activityId: 1 }, { unique: true });
  }

  /**
   * Create uuObject attendance
   * @param {object} uuObject - Object defining the uuObject.
   * @returns {Promise<object>}
   */
  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  /**
   * Finds one uuObject based on awid and id.
   * @param {string} awid
   * @param {string} id
   * @returns {Promise<object>}
   */
  async get(awid, id) {
    let filter = {
      awid,
      id,
    };
    return await super.findOne(filter);
  }

  /**
   * Modifies one uuObject.
   * @param {object} uuObject - Object to be used to modify the existing uuObject.
   * @returns {Promise<object>}
   */
  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  /**
   * Deletes one uuObject based on awid and id.
   * @param {string} awid
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(awid, id) {
    let filter = {
      awid,
      id,
    };
    return await super.deleteOne(filter);
  }

  /**
   * Returns a object consisting of itemList - list of matched uuObjects and pageInfo - object with pageIndex, pageSize and total.
   * @param {string} awid
   * @param {object} pageInfo
   * @returns {Promise<{itemList: [object], pageInfo: PageInfo}>}
   */
  async list(awid, pageInfo = {}) {
    let filter = {
      awid,
    };
    return await super.find(filter, pageInfo);
  }

  /**
   * Finds one uuObject based on awid and activityId.
   * @param {string} awid
   * @param {string} activityId
   * @returns {Promise<object>}
   */
  async getByActivityId(awid, activityId) {
    let filter = {
      awid,
      activityId,
    };
    return await super.findOne(filter);
  }

  /**
   * Deletes uuObject based on awid and activityId.
   * @param {string} awid
   * @param {string} activityId
   * @returns {Promise<void>}
   */
  async deleteByActivityId(awid, activityId) {
    let filter = {
      awid,
      activityId,
    };
    return await super.deleteOne(filter);
  }
}

module.exports = DatetimeMongo;

/**
 * Information about returned itemList - standard page info.
 * @typedef PageInfo
 * @property {number} pageIndex
 * @property {number} pageSize
 * @property {number} total
 */
