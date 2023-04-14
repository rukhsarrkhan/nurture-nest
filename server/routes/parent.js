const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const helperFunc = require("../helpers");
const parentData = require("../data/parent");

router.route("/").post(async (req, res) => {
    return res.json({ message: "Hello" });
});
router
    .route("/:parentId")
    .get(async (req, res) => {
        let parentId = req.params.parentId;
        try {
            parentId = await helperFunc.execValdnAndTrim(parentId, "ParentId");
            if (!ObjectId.isValid(parentId)) {
                throw { statusCode: 400, message: "parentId is not valid" };
            }
            const parentObj = await parentData.getParentById(parentId);
            if (!parentObj) throw { statusCode: 404, message: "parentId is not valid" };
            return res.json(parentObj);
        } catch (error) {
            return res.status(error.statusCode).json({ message: error.message });
        }
    })
    .put(async (req, res) => {})
    .delete(async (req, res) => {});

module.exports = router;
