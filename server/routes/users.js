const express = require('express');
const router = express.Router();
const data = require("../data");
const userCollection = data.users;

router
      .route("/signup")
      .post(async (req, res) => {
            let { username, password, email, type, age, photo, lctn } = req.body;
            try {
                  const userCreated = await userCollection.createUser(username, password, email, type, age, photo, lctn);
                  if (!userCreated) { throw "Couldn't Create user"; }
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