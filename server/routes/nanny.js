const express = require('express');
const router = express.Router();
const data = require("../data");
const nannyData = data.nanny;
const childData = data.child;
const helperFunction = require("../helpers");
const { ObjectId } = require("mongodb");

router
    .route("/dashboard/:nannyId")
    .get(async (req, res) => {
        try {
            await helperFunction.isIdValid(req.params.nannyId, "nannyId")
            const nannyDetails = await nannyData.getNannyById(req.params.nannyId);
            const childDetails = await childData.getChildById(nannyDetails.n_childIds[0])
            const dashboardData = { "nannyId": req.params.nannyId, "childName": childDetails.name, "childId": nannyDetails.n_childIds[0], "childAge": childDetails.age, "sex": childDetails.sex, "vaccineDetails": childDetails.vaccine, "appointmentDetails": childDetails.appointments, "mealRequirements": childDetails.mealRequirements }
            return res.status(200).json(dashboardData);
        } catch (e) {
            return res.status(404).json("could not load dashboard")
        }
    });
router
    .route('/:nannyId')
    .get(async (req, res) => {

        if (!ObjectId.isValid(req.params.nannyId)) throw { statusCode: 400, message: `nannyId provided is not a valid ObjectId` }
        req.params.nannyId = await helperFunction.validateInput(req.params.nannyId, "nannyId")
        const findNanny = await nannyData.getNannyById(req.params.nannyId)
        return res.status(200).json(findNanny)
    })
    .put(async (req, res) => {
    })
    .delete(async (req, res) => {
        if (!ObjectId.isValid(req.params.nannyId)) throw { statusCode: 400, message: `nannyId provided is not a valid ObjectId` }
        const deletedNanny = await nannyData.removeNanny(req.params.nannyId);
        return res.status(200).json("user successfully deleted")
    });

module.exports = router;