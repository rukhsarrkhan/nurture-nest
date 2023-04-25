const express = require('express');
const router = express.Router();
const data = require("../data");
const childCollection = data.child;
const helper = require('../helpers')
const { ObjectId } = require("mongodb");

router
      .route("/")
      .post(async (req, res) => {
            try {
                  let { name, age, sex, jobId, mealRequirements, vaccine, nannyId, appointments } = req.body;
                  const childCreated = await childCollection.createChild(name, age, sex, jobId, mealRequirements, vaccine, nannyId, appointments);
                  if (!childCreated) { throw "Couldn't create child"; }
                  return res.json(childCreated);
            } catch (e) { return res.status(404).json({ error: e }); }
      });
router
      .route('/:childId')
      .get(async (req, res) => {
            try {
                  const childFound = await childCollection.getChildById(req.params.childId);
                  if (!childFound) { throw "Child not found"; }
                  return res.json(childFound);
            } catch (e) { return res.status(404).json({ error: e }); }
      })
      .put(async (req, res) => {
            try {
                  let { name, age, sex, jobId, mealRequirements, vaccine, nannyId, appointments } = req.body;
                  const updatedChild = await childCollection.updateChild(req.params.childId, name, age, sex, jobId, mealRequirements, vaccine, nannyId, appointments);
                  if (!updatedChild) { throw "Couldn't update child"; }
                  res.json(updatedChild);
            } catch (e) { return res.status(400).json({ error: e }); }
      })
      .delete(async (req, res) => {
            try {
                  const childDeleted = await childCollection.removeChild(req.params.childId);
                  res.json({ Awesome: `child with id: ${req.params.childId} deleted successfully` });
            } catch (e) { return res.status(404).json({ error: e }); }
      });

      router
      .route("/vaccine/:childId")
      .get(async (req, res) => {
            childId = req.params.childId
            try {
                  helper.validateInput(childId,"child Id")
                  helper.onlyLettersNumbersAndSpaces(childId, "child Id")
                  helper.isIdValid(childId)
                  
                } catch (e) {
                  console.log(e)
                  return res.status(400).json({ error: e }); 
                }
                try {
                  const vaccineFound = await childCollection.getVaccines(childId);
                  if (!vaccineFound) { throw "Child not found"; }
                  return res.json(vaccineFound);
            } catch (e) {
                  console.log(e) 
                  return res.status(404).json({ error: e });
             }
      })
      .post(async (req, res) => {
            childId = req.params.childId
            try {
                  helper.validateInput(childId,"child Id")
                  helper.onlyLettersNumbersAndSpaces(childId, "child Id")
                  helper.isIdValid(childId)
                  
                } catch (e) {
                  console.log(e)
                  return res.status(400).json({ error: e }); 
                }

            try {
                  const vaccineAdded = await childCollection.addVaccine(req.body, childId);
                  if (!vaccineAdded) { throw "Couldn't creatva"}
                  return res.json(vaccineAdded);
            } catch (e) { return res.status(404).json({ error: e }); }
      });

      router
      .route("/appointment/:childId")
      .get(async (req, res) => {
            childId = req.params.childId
            try {
                  helper.validateInput(childId,"child Id")
                  helper.onlyLettersNumbersAndSpaces(childId, "child Id")
                  helper.isIdValid(childId)
                  
                } catch (e) {
                  console.log(e)
                  return res.status(400).json({ error: e }); 
                }

            
            try {
                  const appointmentFound = await childCollection.getAppointments(childId);
                  if (!appointmentFound) { throw "appointment not found"; }
                  return res.json(appointmentFound);
            } catch (e) {
                  console.log(e) 
                  return res.status(404).json({ error: e });
             }
      })
      .post(async (req, res) => {
            childId = req.params.childId
            try {
                  helper.validateInput(childId,"child Id")
                  helper.onlyLettersNumbersAndSpaces(childId, "child Id")
                  helper.isIdValid(childId)
                  
                } catch (e) {
                  console.log(e)
                  return res.status(400).json({ error: e }); 
                }

            try {
                  const appointmentAdded = await childCollection.addAppointment(req.body, childId);
                  if (!appointmentAdded) { throw "Couldn't create"}
                  return res.json(appointmentAdded);
            } catch (e) {
                  console.log(e)
                   return res.status(404).json({ error: e }); }
      });

      router
      .route("/mealplan/:childId")
      .get(async (req, res) => {
            childId = req.params.childId
            try {
                  helper.validateInput(childId,"child Id")
                  helper.onlyLettersNumbersAndSpaces(childId, "child Id")
                  helper.isIdValid(childId)
                  const mealsFound = await childCollection.getMealPlans(childId);
                  if (!mealsFound) { throw "Meals not found"; }
                  return res.json(mealsFound);
                } catch (e) {
                  console.log(e)
                  return res.status(400).json({ error: e }); 
                }
      })

module.exports = router;