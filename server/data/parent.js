const mongoCollections = require("../config/mongo-collections");
const { ObjectId } = require("mongodb");
const helperFunc = require("../helpers");

const createParent = async (userId, socketId) => {
    userId = await helperFunc.execValdnAndTrim(userId, "User Id");
    if (!ObjectId.isValid(userId)) {
        throw { statusCode: 401, message: "userId is not valid" };
    }
    socketId = await helperFunc.execValdnAndTrim(socketId, "User Id");
    if (!ObjectId.isValid(socketId)) {
        throw { statusCode: 401, message: "socketId is not valid" };
    }
    let newParent = {
        userId: userId,
        socketId: socketId,
        children: [],
    };
    const parentCollection = await mongoCollections.parent();
    const insertInfo = await parentCollection.insertOne(newParent);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw { statusCode: 500, message: "Could not add a parent" };
    const newId = insertInfo.insertedId.toString();
    newParent._id = newId;
    const returnObj = Object.assign({ _id: newId }, newParent);
    return returnObj;
};

const getParentById = async (parentId) => {
    parentId = await helperFunc.execValdnAndTrim(parentId, "ParentId");
    if (!ObjectId.isValid(parentId)) {
        throw { statusCode: 401, message: "parentId is not valid" };
    }
    const parentCollection = await mongoCollections.parent();
    const parentObj = await parentCollection.findOne({ _id: ObjectId(parentId) });
    if (!parentObj || parentObj === null || parentObj === undefined) throw { statusCode: 404, message: `No parent exists with that id` };
    return parentObj;
};

const updateParent = async () => {};

const removeParent = async () => {};

module.exports = {
    createParent,
    getParentById,
    updateParent,
    removeParent,
};
