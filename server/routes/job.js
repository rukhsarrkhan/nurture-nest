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
    .route("/createJob/:parentId/:childId")
    .post(async (req, res) => {
        //Create Job from Parent side
        console.log("inside create Job route")
        let { parentId, childId } = req.params;
        let { shifts, description, address, specialCare, salary, state, zipCode } = req.body;
        try {
            // Validations
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
            const jobFound = await jobCollection.getMyJob(jobId);
            if (!jobFound) { throw "Couldn't find Job with that id"; }
            return res.json(jobFound);
        } catch (e) {
            // throw e
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
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
            // throw e.message;
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        }
    });

router
    .route('/apply/:jobId/:nannyId')
    .put(async (req, res) => {
        //Add an Nanny Application to a Job
        try {
            ////////////Params validation
            let {jobId,nannyId} = req.params;
            jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
            if (!ObjectId.isValid(jobId)) throw { statusCode: 400, message: "invalid object ID for Job" };
            nannyId = await helpers.execValdnAndTrim(nannyId, "Nanny Id");
            if (!ObjectId.isValid(nannyId)) throw { statusCode: 400, message: "invalid object ID for Nanny" };
            /////////////
            console.log("inside applytoJob route with jobId and nannyId:",jobId,nannyId)
            jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
            if (!ObjectId.isValid(jobId)) throw { statusCode: 400, message: "invalid object ID for Job" };
            let { nannyName,contact,city,state,zipCode, distance, nannyAddress, whySelect, disability, shiftPuntuality, experience, attachment } = req.body;
            //////////Validations
            nannyName = await helpers.execValdnAndTrim(nannyName, "Nanny Name");
            await helpers.isNameValid(nannyName, "Nanny Name")
            contact = await helpers.execValdnAndTrim(contact, "Phone Number");
            await helpers.validatePhoneNumber(contact, "Phone Number")
            nannyAddress = await helpers.isAddressParentValid(nannyAddress, "Nanny Address");
            await helpers.isNameValid(nannyAddress, "Nanny Address")
            city = await helpers.execValdnAndTrim(city, "City");
            await helpers.isCityParentValid(city, "City")
            state = await helpers.execValdnAndTrim(state, "State");
            await helpers.isStateParentValid(state, "State")
            zipCode = await helpers.execValdnAndTrim(zipCode, "ZipCode");
            await helpers.isZipCodeParentValid(zipCode, "ZipCode")
            distance = await helpers.execValdnAndTrim(distance, "Distance from Job");
            await helpers.isDistanceInputValid(distance, "Distance from Job")
            if(shiftPuntuality){shiftPuntuality=shiftPuntuality.trim()}
            if(description){description=description.trim()}
            if(disability){disability=disability.trim()}
            if(experience){experience=experience.trim()}
            if(coverLetter){attachment=attachment.trim()}
            ///////////////
            const applicationCreated = await jobCollection.addApplication(jobId, nannyId, nannyName,contact,city,state,zipCode, distance, nannyAddress, whySelect, disability, shiftPuntuality, experience, attachment);
            if (!applicationCreated) { throw "Couldn't Create Application"; }
            return res.json(applicationCreated);
        } catch (e) {
            // throw e.message
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        }
    })

router
    .route('/searchApplicants/:jobId/:searchTerm/:pageNum')
    .get(async (req, res) => {
        // Searching Applicats from Parent side
        let { jobId, searchTerm, pageNum } = req.params;
        try {
            const searchedApplicants = await jobCollection.searchApplications(jobId, searchTerm, pageNum);
            if (!searchedApplicants) { throw "Couldn't get applications"; }
            return res.json(searchedApplicants);
        } catch (e) {
            // throw e;
            return res.status(400).json({ error: e });
        }
    });

router
    .route('/allApplicants/:jobId/:pageNum')
    .get(async (req, res) => {
        // Find all Applicants from Parent side
        let {jobId,pageNum} = req.params;
        try {
            const allApplicants = await jobCollection.getAllApplicants(jobId,pageNum);
            console.log(allApplicants,"outside datafunc")
            if (!allApplicants) { throw "Couldn't get applications"; }
            return res.json(allApplicants);
        } catch (e) {
            // throw e;
            return res.status(400).json({ error: e });
        }
    });

router
    .route('/setNanny/:jobId/:nannyId')
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
            // throw e.message
              return res.status(400).json({ error: e }); 
        }
    });

router
    .route('/getJobs/AllJobs/:pageNum')
    .get(async (req, res) => {
        // Searching Applicats from Parent side
        let { pageNum } = req.params;
        console.log("in getAllJobs route with pageNUM:",pageNum)
        try {
            if(pageNum){
            if(isNaN(pageNum)){throw { statusCode: 400, message: "Invalid page number argument"}}
            // pageNo = parseInt(req.query.page)/////Check if it works with convrt to int,if yes then do it
          }else{
            pageNum = 1
          }
          if(pageNum<1){ throw { statusCode: 400, message: "Invalid negative page number argument"}}
            const searchedApplicants = await jobCollection.getAllJobs(pageNum);
            if (!searchedApplicants) { throw  {statusCode: 400, message:"No applications for this search"} }
            console.log(searchedApplicants,"in routeee for getAllApplications")
            return res.json(searchedApplicants);
        } catch (e) {
            // throw e.message
            return res.status(400).json({ error: e });
        }
    });

router
    .route('/searchJobs/:searchTerm/:pageNum')
    .get(async (req, res) => {
        ///// Searching Applicants from Parent side
        let { pageNum, searchTerm } = req.params;
        try {
            if(pageNum){
                if(isNaN(pageNum)){throw { statusCode: 400, message: "Invalid page number argument"}}
                ///// pageNo = parseInt(req.query.page)/////Check if it works with convert to int,if yes then do it
              }else{ pageNum = 1 }
              if(pageNum<1){ throw { statusCode: 400, message: "Invalid negative page number argument"}}
            const searchedApplicants = await jobCollection.searchJobsBasedOnCity(searchTerm,pageNum);
            if (!searchedApplicants) { throw "Couldn't get applications"; }
            return res.json(searchedApplicants);
        } catch (e) {
            // throw e.message
            return res.status(400).json({ error: e });
        }
    });

router
    .route('/applications/myApplications/appliedJobs/:nannyId')
    .get(async (req, res) => {
        // Searching Applicants from Parent side
        let { nannyId } = req.params;
        try {
            const searchedApplicants = await jobCollection.findMyAppliedJobs(nannyId);
            if (!searchedApplicants) { throw "Couldn't get applications"; }
            return res.json(searchedApplicants);
        } catch (e) {
            // throw e.message
            return res.status(400).json({ error: e });
        }
    });

module.exports = router;
