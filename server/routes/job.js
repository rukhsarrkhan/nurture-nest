const express = require('express');
const router = express.Router();
const data = require("../data");
const { getAllApplicants, addApplication } = require('../data/job');
const jobCollection = data.job;

router
    .route("/createJob")
    .post(async (req, res) => {
        let { shifts, description, address, specialCare, salary } = req.body;
        try {
              const jobCreated = await jobCollection.createJob(parentId, childId, shifts, description, address, specialCare, salary);
              if (!jobCreated) { throw "Couldn't Create job"; }
              return res.json(jobCreated);
        } catch (e) { 
            // throw e
              return res.status(400).json({ error: e }); 
        }
  });
router
    .route('/:jobId')
    .get(async (req, res) => {
    })
    .put(async (req, res) => {
        console.log("Inside add application route")
        let jobId = req.params.jobId
        let { nannyId,nannyName,distance,nannyAddress,whySelect,disability,shiftPuntuality,experience,attachment,expectedSalary } = req.body;
        try {
              const applicationCreated = await jobCollection.addApplication(jobId,nannyId,nannyName,distance,nannyAddress,whySelect,disability,shiftPuntuality,experience,attachment,expectedSalary);
              if (!applicationCreated) { throw "Couldn't Create Application"; }
              return res.json(applicationCreated);
        } catch (e) { 
            // throw e
              return res.status(400).json({ error: e }); 
        }
    })
    .delete(async (req, res) => {
    });

router
    .route('/:jobId/:searchTerm')
    .get(async (req, res) => {
        let {jobId,searchTerm} = req.params
        try {
              const searchedApplicants = await jobCollection.searchApplications(jobId,searchTerm);
              console.log("This was searched in routes",searchedApplicants)
              if (!searchedApplicants) { throw "Couldn't get applications"; }
              return res.json(searchedApplicants);
        } catch (e) { 
            throw e
              return res.status(400).json({ error: e }); 
        }
    });

router
    .route('/:jobId/allApplicants/:pageNum')
    .get(async (req, res) => {
        let jobId = req.params.jobId
        try {

              const allApplicants = await jobCollection.getAllApplicants(jobId);
              if (!allApplicants) { throw "Couldn't get applications"; }
              return res.json(allApplicants);
        } catch (e) { 
            throw e
              return res.status(400).json({ error: e }); 
        }
    });

module.exports = router;