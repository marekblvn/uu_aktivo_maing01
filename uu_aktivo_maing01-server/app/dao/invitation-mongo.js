"use strict";

const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

/**
 * Data access object for uuObject {@link https://uuapp.plus4u.net/uu-bookkit-maing01/a0a59dd9c4f14b7694ed686c96917ada/book/page?code=09683042 invitation}.
 */
class InvitationMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, activityId: 1 }, { unique: false });
    await super.createIndex({ awid: 1, uuIdentity: 1 }, { unique: false });
    await super.createIndex({ awid: 1, activityId: 1, uuIdentity: 1 }, { unique: true });
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
   * Finds one uuObject based on awid, activityId and uuIdentity.
   * @param {string} awid
   * @param {string} activityId
   * @param {string} uuIdentity
   * @returns {Promise<object>}
   */
  async getByActivityIdAndUuIdentity(awid, activityId, uuIdentity) {
    let filter = {
      awid,
      activityId,
      uuIdentity,
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
   * Items in itemList have additional activityName and createdAt attributes provided in aggregation.
   * @param {string} awid
   * @param {object} filterObject - Object consisting of filters to use for finding uuObjects: activityId, uuIdentity.
   * @param {object} pageInfo
   * @returns {Promise<{itemList: [object], pageInfo: PageInfo}>}
   */
  async list(awid, filterObject = {}, pageInfo = { pageIndex: 0, pageSize: 100 }, sort = {}) {
    const skip = pageInfo.pageIndex * pageInfo.pageSize;
    let filter = {
      awid,
      ...filterObject,
    };
    let aggregationPipeline = [{ $match: filter }];

    if (Object.keys(sort).length > 0) {
      aggregationPipeline.push({ $sort: sort });
    }

    aggregationPipeline.push(
      {
        $lookup: {
          from: "activity",
          localField: "activityId",
          foreignField: "_id",
          as: "activity",
        },
      },
      {
        $unwind: "$activity",
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          paginatedResults: [
            { $skip: skip },
            { $limit: pageInfo.pageSize },
            {
              $project: {
                id: "$_id",
                _id: 0,
                activityId: 1,
                activityName: "$activity.name",
                uuIdentity: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          itemList: "$paginatedResults",
          pageInfo: {
            pageIndex: { $literal: pageInfo.pageIndex },
            pageSize: { $literal: pageInfo.pageSize },
            total: { $arrayElemAt: ["$metadata.total", 0] },
          },
        },
      },
    );

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

module.exports = InvitationMongo;

/**
 * Information about returned itemList - standard page info.
 * @typedef PageInfo
 * @property {number} pageIndex
 * @property {number} pageSize
 * @property {number} total
 */
