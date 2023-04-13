const mongoCollections = require("../config/mongo-collections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const helper = require("../helpers");

const createUser = async (firstName, lastName, email, profile, age) => {
  firstName = await helper.execValdnAndTrim(firstName, "FirstName");
  await helper.isNameValid(firstName, "FirstName");
  lastName = await helper.execValdnAndTrim(lastName, "LastName");
  await helper.isNameValid(lastName, "LastName");
  email = await helper.execValdnAndTrim(email, "Email");
  await helper.isEmailValid(email, "Email");
  profile = await helper.execValdnAndTrim(profile, "Profile");
  await helper.isProfileValid(profile, "Profile");
  age = await helper.execValdnAndTrim(age, "Age");
  await helper.isAgeValid(parseInt(age), "Age");
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email.toLowerCase(),
    profile: profile,
    age: age,
    p_childIds: [],
    n_childIds: [],
    photoUrl: "",
    address: "",
  };
  const userCollection = await users();
  const userMatch = await userCollection.findOne({ email: email.toLowerCase() });
  if (userMatch !== null) throw { statusCode: 400, message: "User already exists with given username" };
  const insertedUser = await userCollection.insertOne(newUser);
  if (!insertedUser.acknowledged || !insertedUser.insertedId)
    throw { statusCode: 500, message: `Couldn't Create user` };
  const user = await getUserById(insertedUser.insertedId.toString());
  return user;
};

const getUserById = async (id) => {
  if (typeof id == "undefined") throw { statusCode: 400, message: "Id parameter not provided" };
  if (typeof id !== "string") throw { statusCode: 400, message: "Id must be a string" };
  if (id.trim().length === 0) {
    throw { statusCode: 400, message: "Id cannot be an empty string or just spaces" };
  }
  id = id.trim();
  if (!ObjectId.isValid(id)) throw { statusCode: 400, message: "Invalid object ID" };
  const userCollection = await users();
  const userFound = await userCollection.findOne({ _id: ObjectId(id) });
  if (userFound === null) throw { statusCode: 500, message: "No user with that id" };
  userFound._id = userFound._id.toString();
  return userFound;
};

const updateUser = async (
  userId,
  username,
  password,
  email,
  type,
  age,
  photo,
  lctn
) => {
  let editedUser = {
    username: username,
    password: password,
    email: email,
    type: type,
    age: age,
    photo: photo,
    lctn: lctn,
  };
  const userCollection = await users();
  const updatedUser = await userCollection.replaceOne(
    { _id: ObjectId(userId) },
    editedUser
  );
  if (!updatedUser.acknowledged || updatedUser.modifiedCount == 0) throw "Couldn't update child";
  const user = await getUserById(userId);
  return user;
};

const removeUser = async (userId) => {
  if (typeof userId == "undefined") throw "Id parameter not provided";
  if (typeof userId !== "string") throw "Id must be a string";
  if (userId.trim().length === 0)
    throw "id cannot be an empty string or just spaces";
  userId = userId.trim();
  if (!ObjectId.isValid(userId)) throw "invalid object ID";
  const userCollection = await users();
  const deletedUser = await userCollection.findOneAndDelete({
    _id: ObjectId(userId),
  });
  if (deletedUser.value == null) {
    throw `Could not delete user with id of ${userId}`;
  }
  deletedUser.value._id = deletedUser.value._id.toString();
  return `User: ${deletedUser.value.username} has been successfully deleted!`;
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  removeUser,
};
