"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

/**
 * Data access object for uuObject {@link https://uuapp.plus4u.net/uu-bookkit-maing01/a0a59dd9c4f14b7694ed686c96917ada/book/page?code=40474103 attendance}.
 */
class AttendanceMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, activityId: 1 }, { unique: false });
  }

  /**
   * Create uuObject attendance.
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
   * Returns an object consisting of itemList - list of uuObjects, and pageInfo - object with pageIndex, pageSize and total.
   * @param {string} awid
   * @param {DateFilters} dateFilters
   * @param {object} pageInfo
   * @returns {Promise<{itemList: [object], pageInfo: PageInfo}>}
   */
  async list(awid, dateFilters, pageInfo = {}) {
    let filter = {
      awid,
      ...dateFilters,
    };
    return await super.find(filter, pageInfo);
  }

  /**
   * Returns an object consisting of itemList - list of uuObjects, and pageInfo - object with pageIndex, pageSize and total.
   * @param {string} awid
   * @param {string} activityId
   * @param {DateFilters} dateFilters
   * @param {object} pageInfo
   * @returns {Promise<{itemList: [object], pageInfo: PageInfo}>}
   */
  async listByActivityId(awid, activityId, dateFilters, pageInfo = {}) {
    let filter = {
      awid,
      activityId,
      ...dateFilters,
    };
    return await super.find(filter, pageInfo);
  }

  /**
   * Deletes uuObjects based on awid and activityId.
   * @param {string} awid
   * @param {string} activityId
   * @returns {Promise<void>}
   */
  async deleteByActivityId(awid, activityId) {
    let filter = {
      awid,
      activityId,
    };
    return await super.deleteMany(filter);
  }
}

module.exports = AttendanceMongo;

/**
 * Information about returned itemList - standard page info.
 * @typedef PageInfo
 * @property {number} pageIndex
 * @property {number} pageSize
 * @property {number} total
 */

/**
 * Filters for the datetime of the attendance uuObject. Has a bottom and top boundary. Bottom boundary is inclusive.
 * @typedef DateFilters
 * @property {object} datetime
 * @property {Date} datetime.$gte - Bottom boundary for the datetime, inclusive
 * @property {Date} datetime.$lt - Top boundary for the datetime
 */
