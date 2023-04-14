const express = require("express");
const router = express.Router();
const userdata = require("../data/users");
const helperFunc = require("../helpers");
const { ObjectId } = require("mongodb");

router.route("/signup").post(async (req, res) => {
    let { username, password, email, type, age, photo, lctn } = req.body;
    try {
        const userCreated = await userdata.createUser(username, password, email, type, age, photo, lctn);
        if (!userCreated) {
            throw "Couldn't Create user";
        }
        return res.json(userCreated);
    } catch (e) {
        return res.status(400).json({ error: e });
    }
});
router
    .route("/:userId")
    .get(async (req, res) => {
        let userId = req.params.userId;
        try {
            userId = await helperFunc.execValdnAndTrim(userId, "userId");
            if (!ObjectId.isValid(userId)) {
                throw { statusCode: 400, message: "parentId is not valid" };
            }
            const userObj = await userdata.getUserById(userId);
            if (!userObj || userObj === null || userObj === undefined) throw { statusCode: 404, message: `No user exists with that id` };
            return res.json(userObj);
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })
    .put(async (req, res) => {
        let { username, password, email, type, age, photo, lctn } = req.body;
        try {
            const updatedUser = await userdata.updateUser(req.params.userId, username, password, email, type, age, photo, lctn);
            if (!updatedUser) {
                throw "Couldn't update user";
            }
            res.json(updatedUser);
        } catch (e) {
            return res.status(400).json({ error: e });
        }
    })
    .delete(async (req, res) => {
        try {
            const userDeleted = await userdata.removeUser(req.params.userId);
            res.json({ Awesome: `user with id: ${req.params.userId} deleted successfully` });
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    });

module.exports = router;
