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
            const postVaccine = req.body;
            try {
                  // helper.validateInput(childId,"child Id")
                  // helper.onlyLettersNumbersAndSpaces(childId, "child Id")
                  // helper.isIdValid(childId)
                  
                } catch (e) {
                  console.log(e)
                  return res.status(400).json({ error: e }); 
                }

            try {
                  const { name,date,doses } = postVaccine;
                  const vaccineAdded = await childCollection.addVaccine(name,date,doses, childId);
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
            postAppointment = req.body
            try {
                  helper.validateInput(childId,"child Id")
                  helper.onlyLettersNumbersAndSpaces(childId, "child Id")
                  helper.isIdValid(childId)
                   await helper.isDateValid(postAppointment.date, "date")
                  // await helper.isTimeValid(appointment.time, "time")
                  
                } catch (e) {
                  console.log(e)
                  return res.status(400).json({ error: e }); 
                }

            try {
                  const { doctor,hospital,date,time } = postAppointment;
                  const appointmentAdded = await childCollection.addAppointment(doctor,hospital,date,time, childId);
                  if (!appointmentAdded) { throw "Couldn't create"}
                  return res.json(appointmentAdded);
            } catch (e) {
                  console.log(e)
                   return res.status(404).json({ error: e }); }
      });

      router
      .route("/vaccine/:vaccineId")
      .delete(async (req, res) => {
            const vaccId = req.params.vaccineId
            try {
                  const removedVaccine = await childCollection.removeVaccine(vaccId)
                  return res.status(200).json(removedVaccine);
                } catch (e) {
                  return res.status(500).json({error: e});
                }
                //code here for DELETE
      })

      router
      .route("/appointment/:appointmentId")
      .delete(async (req, res) => {
            const appointmentId = req.params.appointmentId
            try {
                  const removedAppointment = await childCollection.removeAppointment(appointmentId)
                  return res.status(200).json(removedAppointment);
                } catch (e) {
                  console.log(e,'e')
                  return res.status(500).json({error: e});
                }
                //code here for DELETE
      })

module.exports = router;