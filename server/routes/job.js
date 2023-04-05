const express = require('express');
const router = express.Router();
const data = require("../data");
const jobCollection = data.job;

router
    .route("/createJob")
    .post(async (req, res) => {
        console.log("in post createJob")
        let { shifts, description, address, specialCare, salary } = req.body;
        try {
              const jobCreated = await jobCollection.createJob(shifts, description, address, specialCare, salary);
              if (!jobCreated) { throw "Couldn't Create job"; }
              return res.json(jobCreated);
        } catch (e) { 
            throw e
              return res.status(400).json({ error: e }); 
        }
  });
router
    .route('/:jobId')
    .get(async (req, res) => {
    })
    .put(async (req, res) => {
    })
    .delete(async (req, res) => {
    });

module.exports = router;