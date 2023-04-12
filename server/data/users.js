const mongoCollections = require("../config/mongo-collections");
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');

const createUser = async (firstName, lastName, userName, profile, age) => {
    let newUser = {firstName: firstName, lastName: lastName, userName: userName, profile: profile, age: age}
    const userCollection = await users();
    const insertedUser = await userCollection.insertOne(newUser);
    if (!insertedUser.acknowledged || !insertedUser.insertedId) throw "Could not add User";
    const user = await getUserById(insertedUser.insertedId.toString());
    return user;
  };

const getUserById = async (id) => {
    if (typeof id=="undefined") throw "id parameter not provided";
    if (typeof id !== "string") throw "Id must be a string";
    if (id.trim().length === 0){throw "Id cannot be an empty string or just spaces"};
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "invalid object ID";
    const userCollection = await users();
    const userFound = await userCollection.findOne({ _id: ObjectId(id) });
    if (userFound === null) throw "No user with that id";
    userFound._id = userFound._id.toString();
    return userFound;
  };
const updateUser = async (userId,username, password, email, type, age, photo, lctn) => {
    let editedUser = {username: username, password: password, email:email, type:type, age:age, photo:photo, lctn:lctn};
    const userCollection = await users();
    const updatedUser = await userCollection.replaceOne({ _id: ObjectId(userId) },editedUser);
    if (!updatedUser.acknowledged || updatedUser.modifiedCount==0) throw "Couldn't update child";
    const user = await getUserById(userId);
    return user;
  };

const removeUser = async (userId) => {
    if (typeof userId=="undefined") throw "Id parameter not provided";
    if (typeof userId !== "string") throw "Id must be a string";
    if (userId.trim().length === 0) throw "id cannot be an empty string or just spaces";
    userId = userId.trim();
    if (!ObjectId.isValid(userId)) throw "invalid object ID";
    const userCollection = await users();
    const deletedUser = await userCollection.findOneAndDelete({ _id: ObjectId(userId) });
    if (deletedUser.value == null){throw `Could not delete user with id of ${userId}`;}
    deletedUser.value._id = deletedUser.value._id.toString()
    return `User: ${deletedUser.value.username} has been successfully deleted!`;
  };

  module.exports = {
    createUser,
    getUserById,
    updateUser,
    removeUser
  };