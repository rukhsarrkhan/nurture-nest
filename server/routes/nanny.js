const express = require('express');
const router = express.Router();
const data = require("../data");
const nannyData = data.nanny;
const childData = data.child;
//const mongoCollections = require("../config/mongoCollections");
const helperFunction = require("../helpers");
const { ObjectId } = require("mongodb");

router
    .route("/dashboard/:nannyId")
    .get(async (req, res) => {
        try{
            const nannyDetails = await nannyData.getNannyById(req.params.nannyId);
            console.log("in between")
            const childDetails = await childData.getChildById(nannyDetails.n_childIds[0])
            console.log(childDetails, "....................")
            const dashboardData = {"nannyId": req.params.nannyId ,"childName": childDetails.name, "childId": nannyDetails.n_childIds[0], "childAge": childDetails.age, "sex" : childDetails.sex, "vaccineDetails" : childDetails.vaccine,"appointmentDetails": childDetails.appointments, "mealRequirements":childDetails.mealRequirements}
            return res.status(200).json(dashboardData);
        }catch(e){
            throw e
        }
    });
router
    .route('/:nannyId')
    .get(async (req, res) => {

        if (!ObjectId.isValid(req.params.nannyId)) throw { statusCode: 400, message: `nannyId provided is not a valid ObjectId` }
        req.params.nannyId = await helperFunction.validateInput(req.params.nannyId, "nannyId")
        const findNanny = await nannyData.getNannyById(req.params.nannyId)
        return res.status(200)
    })
    .put(async (req, res) => { 
    })
    .delete(async (req, res) => {
        if (!ObjectId.isValid(req.params.nannyId)) throw { statusCode: 400, message: `nannyId provided is not a valid ObjectId` }
        const deletedNanny = await nannyData.removeNanny(req.params.nannyId);
        return res.status(200)
    });

module.exports = router;