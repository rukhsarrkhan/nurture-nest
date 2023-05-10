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
        } catch (e) {
            if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
                return res.status(e.statusCode).json({ title: "Error", message: e.message });
            } else {
                return res.status(500).json({ title: "Error", message: "Some Error Occured" });
            }
        }
    })
    .put(async (req, res) => {})
    .delete(async (req, res) => {});

module.exports = router;
