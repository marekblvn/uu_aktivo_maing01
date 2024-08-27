"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

/**
 * Data access object for uuObject {@link https://uuapp.plus4u.net/uu-bookkit-maing01/a0a59dd9c4f14b7694ed686c96917ada/book/page?code=40474103 attendance}.
 */
class AttendanceMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, activityId: 1 }, { unique: false });
    await super.createIndex({ awid: 1, activityId: 1, datetime: 1 }, { unique: false });
    await super.createIndex({ awid: 1, activityId: 1, datetime: 1, archived: 1 }, { unique: false });
    await super.createIndex({ awid: 1, datetimeId: 1 }, { unique: false });
  }

  /**
   * Create uuObject attendance.
   * @param {object} uuObject - Object defining the uuObject.
   * @returns {Promise<object>}
   */
  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async count(filter) {
    return await super.count(filter);
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

  async updateMany(awid, filterObject, updateObject) {
    let filter = {
      awid,
      ...filterObject,
    };
    let aggregationPipeline = [
      {
        $match: filter,
      },
      {
        $set: { ...updateObject },
      },
      {
        $merge: {
          into: "attendance",
          whenMatched: "merge",
          whenNotMatched: "discard",
        },
      },
    ];
    return await super.aggregate(aggregationPipeline);
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
   * @param {object} filterObject
   * @param {object} pageInfo
   * @returns {Promise<{itemList: [object], pageInfo: PageInfo}>}
   */
  async list(awid, filterObject = {}, pageInfo = {}) {
    let filter = {
      awid,
      ...filterObject,
    };
    return await super.find(filter, pageInfo);
  }

  async getStatistics(awid, filterObject = {}) {
    let filter = {
      awid,
      ...filterObject,
    };
    let aggregationPipeline = [
      { $match: filter },
      {
        $facet: {
          confirmed: [
            { $unwind: "$confirmed" },
            { $project: { uuIdentity: "$confirmed", status: "confirmed", datetimeId: 1 } },
          ],
          denied: [{ $unwind: "$denied" }, { $project: { uuIdentity: "$denied", status: "denied", datetimeId: 1 } }],
          undecided: [
            { $unwind: "$undecided" },
            { $project: { uuIdentity: "$undecided", status: "undecided", datetimeId: 1 } },
          ],
        },
      },
      {
        $project: {
          users: { $concatArrays: ["$confirmed", "$denied", "$undecided"] },
        },
      },
      { $unwind: "$users" },
      { $replaceRoot: { newRoot: "$users" } },
      {
        $group: {
          _id: "$uuIdentity",
          confirmed: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
          },
          denied: {
            $sum: { $cond: [{ $eq: ["$status", "denied"] }, 1, 0] },
          },
          undecided: {
            $sum: { $cond: [{ $eq: ["$status", "undecided"] }, 1, 0] },
          },
          uniqueDatetimeIds: { $addToSet: "$datetimeId" },
        },
      },
      {
        $project: {
          _id: 0,
          uuIdentity: "$_id",
          confirmed: 1,
          denied: 1,
          undecided: 1,
          uniqueDatetimeIds: { $size: "$uniqueDatetimeIds" },
        },
      },
    ];
    return await super.aggregate(aggregationPipeline);
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
