const express = require('express');
const router = express.Router();
const data = require("../data");
const { ObjectId } = require('mongodb');
const { getAllApplicants, addApplication } = require('../data/job');
const helpers = require('../helpers');
const jobCollection = data.job;
const childCollection = data.child;
const userCollection = data.users;


router
    .route("/:parentId/:childId/createJob")
    .post(async (req, res) => {
        //Create Job from Parent side
        let { parentId, childId } = req.params;
        let { shifts, description, address, specialCare, salary, state, zipCode } = req.body;
        try {
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
            parentId = await helpers.execValdnAndTrim(parentId, "Parent Id");
            if (!ObjectId.isValid(parentId)) throw { statusCode: 400, message: "invalid object ID for Parent" };
            childId = await helpers.execValdnAndTrim(childId, "Child Id");
            if (!ObjectId.isValid(childId)) throw { statusCode: 400, message: "invalid object ID for Child" };
            await helpers.isDateValid(shifts.timeFrom.toLocaleString(), "Shift Timing from");
            await helpers.isDateValid(shifts.timeTo.toLocaleString(), "Shift Timing to");
            await helpers.isTime1BeforeTime2(shifts.timeFrom, shifts.timeTo);
            shifts.days = await helpers.execValdnForArr(shifts.days, "Shift-Days");
            shifts.days.map((day) => {
                if (!["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(day)) {
                    throw { statusCode: 400, message: `Shift-Days field contains a invalid day value selected` };
                }
            });
            await helpers.isShiftLimitValid(shifts.timeFrom.toLocaleString(), shifts.timeTo.toLocaleString(), shifts.days.length);
            description = await helpers.execValdnAndTrim(description, "description");
            await helpers.isDescriptionParentValid(description, "Description");
            address = await helpers.execValdnAndTrim(address, "Address");
            await helpers.isAddressParentValid(address, "Address");
            state = await helpers.execValdnAndTrim(state, "State");
            await helpers.isStateParentValid(state, "State");
            zipCode = await helpers.execValdnAndTrim(zipCode, "ZipCode");
            await helpers.isZipCodeParentValid(zipCode, "ZipCode");
            specialCare = await helpers.execValdnAndTrim(specialCare, "SpecialCare");
            await helpers.isSpecialcareParentValid(specialCare, "SpecialCare");
            salary = await helpers.execValdnAndTrim(salary, "Salary");
            await helpers.isSalaryParentValid(salary, "Salary");
        } catch (e) {
            // throw e.message
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        }
        try {
            const jobCreated = await jobCollection.createJob(parentId, childId, shifts, description, address, specialCare, state, zipCode, salary);
            if (!jobCreated) { throw { statusCode: 500, message: `Couldn't Create Job` }; }
            const updateChild = await jobCollection.assignJobToChild(childId, jobCreated._id.toString());
            return res.json(jobCreated);
        } catch (e) {
            // throw e.message
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        }
    });
router
    .route('/:jobId')
    .get(async (req, res) => {
        //required in other routes
        try {
            let jobId = req.params.jobId;
            jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
            if (!ObjectId.isValid(jobId)) throw { statusCode: 400, message: "invalid object ID for Job" };
            const jobFound = await jobCollection.getJobById(jobId);
            if (!jobFound) { throw "Couldn't find Job with that id"; }
            return res.json(jobFound);
        } catch (e) {
            // throw e
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        }
    })
    .put(async (req, res) => {
        //Add an Nanny Application to a Job
        let jobId = req.params.jobId;
        jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
        if (!ObjectId.isValid(jobId)) throw { statusCode: 400, message: "invalid object ID for Job" };
        let { nannyId, nannyName, distance, nannyAddress, whySelect, disability, shiftPuntuality, experience, attachment, expectedSalary } = req.body;
        try {
            const applicationCreated = await jobCollection.addApplication(jobId, nannyId, nannyName, distance, nannyAddress, whySelect, disability, shiftPuntuality, experience, attachment, expectedSalary);
            if (!applicationCreated) { throw "Couldn't Create Application"; }
            return res.json(applicationCreated);
        } catch (e) {
            // throw e
            return res.status(400).json({ error: e });
        }
    })
    .delete(async (req, res) => {
        // Parent deleting a job
        let jobId = req.params.jobId;
        try {
            console.log("insideee route")
            jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
            if (typeof jobId == "undefined") throw { statusCode: 400, message: "jobId parameter not provided" };
            if (typeof jobId !== "string") throw { statusCode: 400, message: "jobId must be a string" };
            if (jobId.trim().length === 0) throw { statusCode: 400, message: "jobIdd cannot be an empty string or just spaces" };
            if (!ObjectId.isValid(jobId)) throw { statusCode: 400, message: "invalid object ID for Job" };
            jobId = jobId.trim();
            const deletedJob = await jobCollection.removeJob(jobId);
            if (!deletedJob) { throw { statusCode: 500, message: `Could not delete Job with id of ${id}` }; };
            const updateChild = await jobCollection.removeJobFromChild(deletedJob.childId.toString());
            return res.json(deletedJob);
        } catch (e) {
            throw e.message;
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        }
    });

router
    .route('/:jobId/searchApplicants/:searchTerm/:pageNum')
    .get(async (req, res) => {
        // Searching Applicats from Parent side
        let { jobId, searchTerm, pageNum } = req.params;
        try {
            const searchedApplicants = await jobCollection.searchApplications(jobId, searchTerm, pageNum);
            if (!searchedApplicants) { throw "Couldn't get applications"; }
            return res.json(searchedApplicants);
        } catch (e) {
            throw e;
            return res.status(400).json({ error: e });
        }
    });

router
    .route('/:jobId/allApplicants/:pageNum')
    .get(async (req, res) => {
        // Find all Applicants from Parent side
        let jobId = req.params.jobId;
        try {
            const allApplicants = await jobCollection.getAllApplicants(jobId);
            if (!allApplicants) { throw "Couldn't get applications"; }
            return res.json(allApplicants);
        } catch (e) {
            throw e;
            return res.status(400).json({ error: e });
        }
    });

router
    .route('/:jobId/setNanny/:nannyId')
    .post(async (req, res) => {
        // Assign nanny to a specific job
        console.log("inside setNannytoJob route")
        let {jobId,nannyId} = req.params
        try {
            jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
            if (typeof jobId == "undefined") throw { statusCode: 400, message: "jobId parameter not provided" };
            if (typeof jobId !== "string") throw { statusCode: 400, message: "jobId must be a string" };
            if (jobId.trim().length === 0) throw { statusCode: 400, message: "jobIdd cannot be an empty string or just spaces" };
            if (!ObjectId.isValid(jobId)) throw { statusCode: 400, message: "invalid object ID for job" };
            nannyId = await helpers.execValdnAndTrim(nannyId, "Job Id");
            if (typeof nannyId == "undefined") throw { statusCode: 400, message: "nannyId parameter not provided" };
            if (typeof nannyId !== "string") throw { statusCode: 400, message: "nannyId must be a string" };
            if (nannyId.trim().length === 0) throw { statusCode: 400, message: "nannyId cannot be an empty string or just spaces" }; 
            if (!ObjectId.isValid(nannyId)) throw { statusCode: 400, message: "invalid object ID for Nanny" };
            // Validations done
              const nannyJobSet = await jobCollection.setNannytoJob(jobId,nannyId);
              if (!nannyJobSet) { throw { statusCode: 400, message:`Could not update and set nanny to Job with jobId of ${jobId} and nannyId of ${nannyId}`} };
              const child = await childCollection.getChildById(nannyJobSet.childId.toString())
              const setChildToNanny = await userCollection.addChildToUser(nannyId,nannyJobSet.childId.toString(),child.name);
              return res.json(nannyJobSet);
        } catch (e) { 
            throw e.message
              return res.status(400).json({ error: e }); 
        }
    });

module.exports = router;
