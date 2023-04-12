const express = require('express');
const router = express.Router();
const data = require("../data");
const helper = require("../helpers");
const userCollection = data.users;


router
      .route("/signup")
      .post(async (req, res) => {
            let { firstName, lastName, email, profile, age } = req.body;
            console.log("firstName, lastName, email, profile, age",firstName, lastName, email, profile, age)
            try {
                 await helper.validateInput(firstName, "FirstName")
                 await helper.validateInput(lastName, "LastName")
                 await helper.validateInput(email, "Email")
                 await helper.validateInput(profile, "Profile")
                 await helper.validateInput(age, "Age")
                 await helper.isNameValid(firstName, "FirstName")
                 await helper.isNameValid(lastName, "LastName")
                 await helper.isEmailValid(email, "Email")
                 await helper.isNameValid(profile, "Profile")
                 await helper.isProfileValid(profile, "Profile")
                 await helper.isAgeValid(parseInt(age), "Age")
            } catch (e) { 
                  return res.status(e.statusCode).json({ title: "Error", message: e.message });
            }
            try {
                  const userCreated = await userCollection.createUser(firstName, lastName, email, profile, age);
                  if (!userCreated) { throw { statusCode: 400, message: `Couldn't Create user` }};
                  return res.json(userCreated);
            } catch (e) { 
                  return res.status(400).json({ error: e }); 
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