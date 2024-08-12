"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

/**
 * Data access object for uuObject {@link https://uuapp.plus4u.net/uu-bookkit-maing01/a0a59dd9c4f14b7694ed686c96917ada/book/page?code=16057142 post}.
 */
class PostMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, activityId: 1 }, { unique: false });
  }

  /**
   * Create uuObject post.
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
   * Returns an object consisting of itemList - list of matched uuObjects based on awid, and pageInfo - object with pageIndex, pageSize and total.
   * @param {string} awid
   * @param {object} pageInfo
   * @param {object} sort
   * @returns {Promise<{itemList: [object], pageInfo: PageInfo}>}
   */
  async list(awid, filterObject = {}, pageInfo = {}, sort = {}) {
    let filter = {
      awid,
      ...filterObject,
    };
    return await super.find(filter, pageInfo, sort);
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

module.exports = PostMongo;

/**
 * Information about returned itemList - standard page info.
 * @typedef PageInfo
 * @property {number} pageIndex
 * @property {number} pageSize
 * @property {number} total
 */
