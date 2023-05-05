const { TypedEventEmitter } = require("mongodb");
const mongoCollections = require("../config/mongo-collections");
const users = mongoCollections.users;
const helperFunction = require("../helpers");
const { ObjectId } = require("mongodb");

const createNanny = async (
  firstName,
  lastName,
  username,
  password,
  email,
  type,
  age,
  childId,
  photo,
  location) => {
  let newNanny = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: password,
    email: email,
    type: type,
    age: age,
    childId: childId,
    photo: photo,
    location: location
  }
    firstName = await helperFunction.validateInput(firstName, "firstName");
    lastName = await helperFunction.validateInput(lastName, "lastName");
    username = await helperFunction.isUsernameValid(username);
    password = await helperFunction.isPasswordValid(password);
    email = await helperFunction.isEmailValid(email);
    age = await helperFunction.isAgeValid(age, "age");

    const nannyCollection = await users();
    const insertedNanny = await nannyCollection.insertOne(newNanny);
    if (!insertedNanny.acknowledged || !insertedNanny.insertedId)
      throw  { statusCode: 400, message: "Could not add User" }; 
    const nanny = await getNannyById(insertedNanny.insertedId.toString());
    return nanny;
};

const getNannyById = async (nannyId) => {

    await helperFunction.isIdValid(nannyId, "nannyId")
    //if (!ObjectId.isValid(nannyId)) throw { statusCode: 400, message: `nannyId provided is not a valid ObjectId` };
    nannyId = await helperFunction.execValdnAndTrim(nannyId, "nannyId");
    const nannyCollection = await users();
    const nannyFound = await nannyCollection.findOne({ _id: ObjectId(nannyId) });
    if (nannyFound === null) throw  { statusCode: 404, message: "No nanny found with that Id" }; 
    nannyFound._id = nannyFound._id.toString();
    return nannyFound;
}

const updateNanny = async (
  nannyId,
  firstName,
  lastName,
  username,
  password,
  email,
  type,
  age,
  photo,
  location) => {

  let editedNanny = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: password,
    email: email,
    type: type,
    age: age,
    photo: photo,
    location: location
  };

  firstName = await helperFunction.validateInput(firstName, "firstName");
  lastName = await helperFunction.validateInput(lastName, "lastName");
  username = await helperFunction.isUsernameValid(username);
  password = await helperFunction.isPasswordValid(password);
  email = await helperFunction.isEmailValid(email);

  age = await helperFunction.isAgeValid(age, "age");

  const nannyCollection = await users();
  const updatedNanny = await nannyCollection.replaceOne(
    { _id: ObjectId(nannyId) },
    editedNanny
  );
  if (!updatedNanny.acknowledged || updatedNanny.modifiedCount == 0) throw { statusCode: 500, message:  "Couldn't update Nanny Details" };
  const nanny = await getNannyById(nannyId);
  return nanny;
};

const removeNanny = async (nannyId) => {
  //nannyId = await helperFunction.isIdValid(nannyId, "nannyId");
    const nannyCollection = await users();
    const deletedNanny = await nannyCollection.findOneAndDelete({ _id: ObjectId(nannyId) });
    if (deletedNanny.value == null) throw  { statusCode: 500, message:`Could not delete nanny with id of ${nannyId}`};
    deletedNanny.value._id = deletedNanny.value._id.toString();
    return `${deletedNanny.value.name} has been successfully deleted!`;
};

module.exports = {
  createNanny,
  getNannyById,
  updateNanny,
  removeNanny,
};
