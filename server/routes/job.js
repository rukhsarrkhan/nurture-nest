const express = require('express');
const router = express.Router();
const data = require("../data");
const { getAllApplicants, addApplication } = require('../data/job');
const helpers = require('../helpers');
const jobCollection = data.job;


router
    .route("/:parentId/:childId/createJob")
    .post(async (req, res) => {
            let {parentId,childId} = req.params
            let { shifts, description, address, specialCare, salary,state,zipCode } = req.body;
            try{
            const dateFrom = new Date(shifts.timeFrom.toLocaleString());
            const dateTo = new Date(shifts.timeTo.toLocaleString());
            const timeStringFrom = dateFrom.toLocaleString("en-US", { timeZone: "America/New_York", timeZoneName: "short" });
            const timeStringTo = dateTo.toLocaleString("en-US", { timeZone: "America/New_York", timeZoneName: "short" });
            const hoursFrom = dateFrom.getUTCHours();
            const minsFrom = dateFrom.getUTCMinutes();
            const hoursTo = dateTo.getHours(); 
            const minsTo = dateTo.getMinutes();
            // Validations
            // Add ObjectId Validation for parentId and childId
            await helpers.isDateValid(shifts.timeFrom.toLocaleString(), "Shift Timing from")
            await helpers.isDateValid(shifts.timeTo.toLocaleString(), "Shift Timing to") 
            await helpers.isTime1BeforeTime2(shifts.timeFrom,shifts.timeTo)
            shifts.days = await helpers.execValdnForArr(shifts.days,"Shift-Days")
            shifts.days.map((day)=>{
                if (!["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].includes(day)){
                    throw { statusCode: 400, message: `Shift-Days field contains a invalid day value selected` }
                }
            })
            description = await helpers.execValdnAndTrim(description,"description")
             await helpers.isDescriptionParentValid(description, "Description")
              address = await helpers.execValdnAndTrim(address,"Address")
              await helpers.isAddressParentValid(address, "Address")
              state =  await helpers.execValdnAndTrim(state,"State")
              await helpers.isStateParentValid(state, "State")
              zipCode = await helpers.execValdnAndTrim(zipCode,"ZipCode")
              await helpers.isZipCodeParentValid(zipCode, "ZipCode")
             specialCare =  await helpers.execValdnAndTrim(specialCare,"SpecialCare")
             await helpers.isSpecialcareParentValid(specialCare, "SpecialCare")
             salary = await helpers.execValdnAndTrim(salary,"Salary")
             await helpers.isSalaryParentValid(salary, "Salary")
            }catch(e){
                // throw e.message
                return res.status(e.statusCode).json({ title: "Error", message: e.message });
            }
            try{
              const jobCreated = await jobCollection.createJob(parentId, childId, shifts, description, address, specialCare, state, zipCode, salary);
              if (!jobCreated) {  throw { statusCode: 500, message: `Couldn't Create Job` }; }
              return res.json(jobCreated);
        } catch (e) { 
            // throw e.message
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        }
  });
router
    .route('/:jobId')
    .get(async (req, res) => {
        try {
            let jobId = req.params.jobId
            const jobFound = await jobCollection.getJobById(jobId);
            if (!jobFound) { throw "Couldn't find Job with that id"; }
            return res.json(jobFound);
      } catch (e) { 
          // throw e
            return res.status(400).json({ error: e }); 
      }
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
        console.log("Inside delete job route")
        let jobId = req.params.jobId
        try {
            if (typeof jobId=="undefined") throw { statusCode: 400, message:"jobId parameter not provided" };
            if (typeof jobId !== "string") throw { statusCode: 400, message:"jobId must be a string"};
            if (jobId.trim().length === 0) throw { statusCode: 400, message:"jobIdd cannot be an empty string or just spaces"};
            jobId = jobId.trim();
              const deletedJob = await jobCollection.removeJob(jobId);
              if (!deletedJob){throw { statusCode: 500, message:`Could not delete Job with id of ${id}`}};
              return res.json(deletedJob);
        } catch (e) { 
            // throw e.message
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        }
    });

router
    .route('/:jobId/searchApplicants/:searchTerm')
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