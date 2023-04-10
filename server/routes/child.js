const express = require('express');
const router = express.Router();
const data = require("../data");
const childCollection = data.child;

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
            try {
                  const vaccineFound = await childCollection.getVaccines(req.params.childId);
                  if (!vaccineFound) { throw "Child not found"; }
                  return res.json(vaccineFound);
            } catch (e) { return res.status(404).json({ error: e }); }
      })
      .post(async (req, res) => {
            try {

                  const vaccineAdded = await childCollection.addVaccine(req.body, req.params.childId);
                  if (!vaccineAdded) { throw "Couldn't creatva"}
                  return res.json(vaccineAdded);
            } catch (e) { return res.status(404).json({ error: e }); }
      });
module.exports = router;