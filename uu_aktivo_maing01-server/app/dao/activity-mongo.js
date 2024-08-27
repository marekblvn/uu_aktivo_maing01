"user strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

/**
 * Data access object for uuObject {@link https://uuapp.plus4u.net/uu-bookkit-maing01/a0a59dd9c4f14b7694ed686c96917ada/book/page?code=56429595 activity}.
 */
class ActivityMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, members: 1 }, { unique: false });
    await super.createIndex({ awid: 1, name: 1 }, { unique: false });
    await super.createIndex({ awid: 1, owner: 1 }, { unique: false });
  }

  /**
   * Create uuObject activity.
   * @param {object} uuObject - Object that defines the uuObject.
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
   * @param {object} filterObject - Object consisting of filters to use for finding uuObjects: state, recurrent, owner.
   * @param {object} pageInfo
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
   * Returns a object consisting of itemList - list of matched uuObjects and pageInfo - object with pageIndex, pageSize and total.
   * @param {string} awid
   * @param {[string]} uuIdentityList
   * @param {object} pageInfo
   *
   * @returns {Promise<{itemList: [object], pageInfo: PageInfo}>}
   */
  async listByMembers(awid, uuIdentityList, pageInfo = {}) {
    let filter = {
      awid,
      members: {
        $all: uuIdentityList,
      },
    };
    return await super.find(filter, pageInfo);
  }
}

module.exports = ActivityMongo;

/**
 * Information about returned itemList - standard page info.
 * @typedef {object} PageInfo
 * @property {number} pageIndex
 * @property {number} pageSize
 * @property {number} total
 */
