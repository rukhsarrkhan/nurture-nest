const mongoCollections = require("../config/mongo-collections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const helper = require("../helpers");
// Email is always inserted in lowercase.. Ensure to always check the same when comparing
const createUser = async (firstName, lastName, email, profile, age, uuid) => {
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
    uuid = await helper.execValdnAndTrim(uuid, "Uuid");

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        profile: profile,
        age: age,
        firebaseUuid: uuid,
        p_childIds: [],
        n_childIds: [],
        photoUrl: "",
        address: "",
    };
    const userCollection = await users();
    const userMatch = await userCollection.findOne({
        email: email.toLowerCase(),
    });
    if (userMatch !== null)
        throw {
            statusCode: 400,
            message: "User already exists with given username",
        };
    const insertedUser = await userCollection.insertOne(newUser);
    if (!insertedUser.acknowledged || !insertedUser.insertedId) throw { statusCode: 500, message: `Couldn't Create user` };
    const user = await getUserById(insertedUser.insertedId.toString());
    return user;
};

const getUserByFirebaseId = async (id) => {
    id = await helper.execValdnAndTrim(id, "Uuid");
    // if (!ObjectId.isValid(id)) throw { statusCode: 400, message: "Invalid object ID" };
    const userCollection = await users();
    const userFound = await userCollection.findOne({ firebaseUuid: id });
    if (userFound === null) throw { statusCode: 404, message: "No user with that id" };
    userFound._id = userFound._id.toString();
    return userFound;
};

const getUserById = async (id) => {
    id = await helper.execValdnAndTrim(id, "UserId");
    if (!ObjectId.isValid(id)) throw { statusCode: 400, message: "Invalid object ID" };
    const userCollection = await users();
    const userFound = await userCollection.findOne({ _id: ObjectId(id) });
    if (userFound === null) throw { statusCode: 404, message: "No user with that id" };
    userFound._id = userFound._id.toString();
    return userFound;
};

const updateUser = async (userId, userObj) => {
    userId = await helper.execValdnAndTrim(userId, "User Id");
    if (!ObjectId.isValid(userId)) throw { statusCode: 400, message: "Invalid object ID" };
    const userCollection = await users();
    if (!userObj || typeof userObj !== "object" || Object.keys(userObj).length == 0) {
        throw { statusCode: 400, message: "No Fields provided for update" };
    }
    let cur_userObj = await getUserById(userId);

    let updatedUser = {};
    if (userObj.firstName) {
        userObj.firstName = await helper.execValdnAndTrim(userObj.firstName, "First Name");
        await helper.isNameValid(userObj.firstName, "First Name");
        if (cur_userObj.firstName != userObj.firstName) updatedUser.firstName = userObj.firstName;
    }
    if (userObj.lastName) {
        userObj.lastName = await helper.execValdnAndTrim(userObj.lastName, "Last Name");
        await helper.isNameValid(userObj.lastName, "Last Name");
        if (cur_userObj.lastName != userObj.lastName) updatedUser.lastName = userObj.lastName;
    }
    // if (userObj.userName) {
    //     userObj.userName = await helper.execValdnAndTrim(userObj.userName, "Username");
    //     updatedUser.userName = userObj.userName;
    // }
    if (userObj.age) {
        userObj.age = await helper.execValdnAndTrim(userObj.age, "Age");
        await helper.isAgeValid(userObj.age, "Age");
        if (cur_userObj.age != userObj.age) updatedUser.age = userObj.age;
    }
    if (userObj.email) {
        userObj.email = await helper.execValdnAndTrim(userObj.email, "Email");
        await helper.isEmailValid(userObj.email, "Email");
        if (cur_userObj.email != userObj.email) updatedUser.email = userObj.email;
    }
    if (userObj.address) {
        userObj.address = await helper.execValdnAndTrim(userObj.address, "Address");
        if (cur_userObj.address != userObj.address) updatedUser.address = userObj.address;
    }
    if (userObj.photoUrl) {
        userObj.photoUrl = await helper.execValdnAndTrim(userObj.photoUrl, "PhotoUrl");
        if (cur_userObj.photoUrl != userObj.photoUrl) updatedUser.photoUrl = userObj.photoUrl;
    }
    if (userObj.profile) {
        userObj.profile = await helper.execValdnAndTrim(userObj.profile, "Profile");
        await helper.isProfileValid(userObj.profile, "Profile");
        if (cur_userObj.profile != userObj.profile) updatedUser.profile = userObj.profile;
    }
    if (userObj.n_yearsOfExperience) {
        userObj.n_yearsOfExperience = await helper.execValdnAndTrim(userObj.n_yearsOfExperience, "Years Of Experience");
        updatedUser.n_yearsOfExperience = userObj.n_yearsOfExperience;
        if (cur_userObj.n_yearsOfExperience != userObj.n_yearsOfExperience) updatedUser.n_yearsOfExperience = userObj.n_yearsOfExperience;
    }
    if (userObj.n_qualifications) {
        userObj.n_qualifications = await helper.execValdnAndTrim(userObj.n_qualifications, "Educational Qualifications");
        updatedUser.n_qualifications = userObj.n_qualifications;
        if (cur_userObj.n_qualifications != userObj.n_qualifications) updatedUser.n_qualifications = userObj.n_qualifications;
    }
    if (userObj.n_certifications) {
        userObj.n_certifications = await helper.execValdnAndTrim(userObj.n_certifications, "Years Of Experience");
        if (cur_userObj.n_certifications != userObj.n_certifications) updatedUser.n_certifications = userObj.n_certifications;
    }
    if (userObj.n_skills) {
        userObj.n_skills = await helper.execValdnAndTrim(userObj.n_skills, "Years Of Experience");
        if (cur_userObj.n_skills != userObj.n_skills) updatedUser.n_skills = userObj.n_skills;
    }
    if (Object.keys(updatedUser).length == 0) throw { statusCode: 400, message: "No fields were changed" };
    const updateResult = await userCollection.updateOne({ _id: ObjectId(userId) }, { $set: userObj });
    if (!updateResult.acknowledged || updateResult.modifiedCount == 0) throw { statusCode: 500, message: "Couldn't update user" };
    cur_userObj = await getUserById(userId);
    return cur_userObj;
};

const removeUser = async (userId) => {
    if (typeof userId == "undefined") throw "Id parameter not provided";
    if (typeof userId !== "string") throw "Id must be a string";
    if (userId.trim().length === 0) throw "id cannot be an empty string or just spaces";
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
    getUserByFirebaseId
};
