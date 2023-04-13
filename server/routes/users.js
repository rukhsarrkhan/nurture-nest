const express = require('express');
const router = express.Router();
const data = require("../data");
const helper = require("../helpers");
const userCollection = data.users;


router
      .route("/signup")
      .post(async (req, res) => {
            let { firstName, lastName, email, profile, age } = req.body;
            try {
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
            } catch (e) {
                  return res.status(e.statusCode).json({ title: "Error", message: e.message });
            }
            try {
                  const userCreated = await userCollection.createUser(firstName, lastName, email, profile, age);
                  if (!userCreated) { throw { statusCode: 500, message: `Couldn't Create user` }; };
                  return res.json(userCreated);
            } catch (e) {
                  return res.status(e.statusCode).json({ title: "Error", message: e.message });
            }
      });
router
      .route('/:userId')
      .get(async (req, res) => {
            try {
                  const userFound = await userCollection.getUserById(req.params.userId);
                  if (!userFound) { throw "User not found"; }
                  return res.json(userFound);
            } catch (e) { return res.status(404).json({ error: e }); }
      })
      .put(async (req, res) => {
            let { username, password, email, type, age, photo, lctn } = req.body;
            try {
                  const updatedUser = await userCollection.updateUser(req.params.userId, username, password, email, type, age, photo, lctn);
                  if (!updatedUser) { throw "Couldn't update user"; }
                  res.json(updatedUser);
            } catch (e) { return res.status(400).json({ error: e }); }
      })
      .delete(async (req, res) => {
            try {
                  const userDeleted = await userCollection.removeUser(req.params.userId);
                  res.json({ Awesome: `user with id: ${req.params.userId} deleted successfully` });
            } catch (e) { return res.status(404).json({ error: e }); }
      });

module.exports = router;