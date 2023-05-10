const express = require("express");
const router = express.Router();
const data = require("../data");
const { ObjectId } = require("mongodb");
const { getAllApplicants, addApplication } = require("../data/job");
const helpers = require("../helpers");
const jobCollection = data.job;
const childCollection = data.child;
const userCollection = data.users;
const xss = require("xss");

router.route("/createJob/:parentId/:childId").post(async (req, res) => {
    //Create Job from Parent side
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
        // await helpers.isTime1BeforeTime2(shifts.timeFrom, shifts.timeTo);
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
        if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        } else {
            return res.status(500).json({ title: "Error", message: "Some Error Occured" });
        }
    }
    try {
        const jobCreated = await jobCollection.createJob(
            xss(parentId),
            xss(childId),
            shifts,
            xss(description),
            xss(address),
            xss(specialCare),
            xss(state),
            xss(zipCode),
            xss(salary)
        );
        if (!jobCreated) {
            throw { statusCode: 500, message: `Couldn't Create Job` };
        }
        const updateChild = await jobCollection.assignJobToChild(childId, jobCreated._id.toString());
        return res.json(jobCreated);
    } catch (e) {
        if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        } else {
            return res.status(500).json({ title: "Error", message: "Some Error Occured" });
        }
    }
});
router
    .route("/:jobId")
    .get(async (req, res) => {
        //required in other routes
        try {
            let jobId = req.params.jobId;
            jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
            if (!ObjectId.isValid(jobId)) throw { statusCode: 400, message: "invalid object ID for Job hai idhar" };
            const jobFound = await jobCollection.getMyJob(jobId);
            if (!jobFound) {
                throw "Couldn't find Job with that id";
            }
            return res.json(jobFound);
        } catch (e) {
            if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
                return res.status(e.statusCode).json({ title: "Error", message: e.message });
            } else {
                return res.status(500).json({ title: "Error", message: "Some Error Occured" });
            }
        }
    })
    .delete(async (req, res) => {
        // Parent deleting a job
        let jobId = req.params.jobId;
        try {
            jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
            if (typeof jobId == "undefined") throw { statusCode: 400, message: "jobId parameter not provided" };
            if (typeof jobId !== "string") throw { statusCode: 400, message: "jobId must be a string" };
            if (jobId.trim().length === 0) throw { statusCode: 400, message: "jobIdd cannot be an empty string or just spaces" };
            if (!ObjectId.isValid(jobId)) throw { statusCode: 400, message: "invalid object ID for Job111111", jobId: jobId };
            jobId = jobId.trim();
            const deletedJob = await jobCollection.removeJob(jobId);
            if (!deletedJob) {
                throw { statusCode: 500, message: `Could not delete Job with id of ${id}` };
            }
            const updateChild = await jobCollection.removeJobFromChild(deletedJob.childId.toString());
            return res.json(deletedJob);
        } catch (e) {
            if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
                return res.status(e.statusCode).json({ title: "Error", message: e.message });
            } else {
                return res.status(500).json({ title: "Error", message: "Some Error Occured" });
            }
        }
    });

router.route("/apply/:jobId/:nannyId").put(async (req, res) => {
    //Add an Nanny Application to a Job
    try {
        ////////////Params validation
        let { jobId, nannyId } = req.params;
        jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
        if (!ObjectId.isValid(jobId)) throw { statusCode: 400, message: "invalid object ID for Job" };
        nannyId = await helpers.execValdnAndTrim(nannyId, "Nanny Id");
        if (!ObjectId.isValid(nannyId)) throw { statusCode: 400, message: "invalid object ID for Nanny" };
        /////////////
        jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
        if (!ObjectId.isValid(jobId)) throw { statusCode: 400, message: "invalid object ID for Job" };
        let { nannyName, contact, city, state, zipCode, distance, nannyAddress, whySelect, disability, shiftPuntuality, experience, attachment } =
            req.body;
        //////////Validations
        nannyName = await helpers.execValdnAndTrim(nannyName, "Nanny Name");
        await helpers.isNameValid(nannyName, "Nanny Name");
        contact = await helpers.execValdnAndTrim(contact, "Phone Number");
        await helpers.validatePhoneNumber(contact, "Phone Number");
        nannyAddress = await helpers.execValdnAndTrim(nannyAddress, "Nanny Address");
        await helpers.isAddressParentValid(nannyAddress, "Nanny Address");
        city = await helpers.execValdnAndTrim(city, "City");
        await helpers.isCityParentValid(city, "City");
        state = await helpers.execValdnAndTrim(state, "State");
        await helpers.isStateParentValid(state, "State");
        zipCode = await helpers.execValdnAndTrim(zipCode, "ZipCode");
        await helpers.isZipCodeParentValid(zipCode, "ZipCode");
        distance = await helpers.execValdnAndTrim(distance, "Distance from Job");
        await helpers.isDistanceInputValid(distance, "Distance from Job");
        if (shiftPuntuality) {
            shiftPuntuality = shiftPuntuality.trim();
        }
        if (whySelect) {
            whySelect = whySelect.trim();
        }
        if (disability) {
            disability = disability.trim();
        }
        if (experience) {
            experience = experience.trim();
        }
        if (attachment) {
            attachment = attachment.trim();
        }
        ///////////////
        const applicationCreated = await jobCollection.addApplication(
            xss(jobId),
            xss(nannyId),
            xss(nannyName),
            xss(contact),
            xss(city),
            xss(state),
            xss(zipCode),
            xss(distance),
            xss(nannyAddress),
            xss(whySelect),
            xss(disability),
            xss(shiftPuntuality),
            xss(experience),
            xss(attachment)
        );
        if (!applicationCreated) {
            throw "Couldn't Create Application";
        }
        return res.json(applicationCreated);
    } catch (e) {
        if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        } else {
            return res.status(500).json({ title: "Error", message: "Some Error Occured" });
        }
    }
});

router.route("/searchApplicants/:jobId/:searchTerm/:pageNum").get(async (req, res) => {
    // Searching Applicats from Parent side
    let { jobId, searchTerm, pageNum } = req.params;
    try {
        const searchedApplicants = await jobCollection.searchApplications(jobId, searchTerm, pageNum);
        return res.json(searchedApplicants);
    } catch (e) {
        if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        } else {
            return res.status(500).json({ title: "Error", message: "Some Error Occured" });
        }
    }
});

router.route("/allApplicants/:jobId/:pageNum").get(async (req, res) => {
    // Find all Applicants from Parent side
    let { jobId, pageNum } = req.params;
    try {
        jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
        if (typeof jobId == "undefined") throw { statusCode: 400, message: "jobId parameter not provided" };
        if (typeof jobId !== "string") throw { statusCode: 400, message: "jobId must be a string" };
        if (jobId.trim().length === 0) throw { statusCode: 400, message: "jobIdd cannot be an empty string or just spaces" };
        if (!ObjectId.isValid(jobId)) throw { statusCode: 400, message: "invalid object ID for job" };
        if (pageNum) {
            if (isNaN(pageNum)) {
                throw { statusCode: 400, message: "Invalid page number argument" };
            }
        } else {
            pageNum = 1;
        }
        if (pageNum < 1) {
            throw { statusCode: 400, message: "Invalid negative page number argument" };
        }
        const allApplicants = await jobCollection.getAllApplicants(jobId, pageNum);

        if (allApplicants == null) {
            throw { statusCode: 200, message: "No Nanny for this Job Applications yet" };
        }
        return res.json(allApplicants);
    } catch (e) {
        if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        } else {
            return res.status(500).json({ title: "Error", message: "Some Error Occured" });
        }
    }
});

router.route("/setNanny/:jobId/:nannyId").post(async (req, res) => {
    // Assign nanny to a specific job
    let { jobId, nannyId } = req.params;
    try {
        jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
        if (typeof jobId == "undefined") throw { statusCode: 400, message: "jobId parameter not provided" };
        if (typeof jobId !== "string") throw { statusCode: 400, message: "jobId must be a string" };
        if (jobId.trim().length === 0)
            throw {
                statusCode: 400,
                message: "jobIdd cannot be an empty string or just spaces",
            };
        if (!ObjectId.isValid(jobId)) throw { statusCode: 400, message: "invalid object ID for job" };
        nannyId = await helpers.execValdnAndTrim(nannyId, "Job Id");
        if (typeof nannyId == "undefined") throw { statusCode: 400, message: "nannyId parameter not provided" };
        if (typeof nannyId !== "string") throw { statusCode: 400, message: "nannyId must be a string" };
        if (nannyId.trim().length === 0)
            throw {
                statusCode: 400,
                message: "nannyId cannot be an empty string or just spaces",
            };
        if (!ObjectId.isValid(nannyId)) throw { statusCode: 400, message: "invalid object ID for Nanny" };
        // const nannyChec = await jobCollection.getJobByNannyId(nannyId)
        //Add nanny No longer available Validation
        // Validations done
        const nannyJobSet = await jobCollection.setNannytoJob(jobId, nannyId);
        if (!nannyJobSet) {
            throw {
                statusCode: 400,
                message: `Could not update and set nanny to Job with jobId of ${jobId} and nannyId of ${nannyId}`,
            };
        }
        const child = await childCollection.getChildById(nannyJobSet.childId.toString());
        const setChildToNanny = await userCollection.addChildToUser(xss(nannyId), xss(nannyJobSet.childId.toString()), xss(child.name));
        return res.json(nannyJobSet);
    } catch (e) {
        if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        } else {
            return res.status(500).json({ title: "Error", message: "Some Error Occured" });
        }
    }
});

router.route("/getJobs/AllJobs/:nannyId/:pageNum").get(async (req, res) => {
    // Searching Applicats from Parent side
    let { nannyId, pageNum } = req.params;
    try {
        nannyId = await helpers.execValdnAndTrim(nannyId, "Job Id");
        if (typeof nannyId == "undefined") throw { statusCode: 400, message: "nannyId parameter not provided" };
        if (typeof nannyId !== "string") throw { statusCode: 400, message: "nannyId must be a string" };
        if (nannyId.trim().length === 0)
            throw {
                statusCode: 400,
                message: "nannyId cannot be an empty string or just spaces",
            };
        if (!ObjectId.isValid(nannyId)) throw { statusCode: 400, message: "invalid object ID for Nanny" };
        if (pageNum) {
            if (isNaN(pageNum)) {
                throw { statusCode: 400, message: "Invalid page number argument" };
            }
            // pageNo = parseInt(req.query.page)/////Check if it works with convrt to int,if yes then do it
        } else {
            pageNum = 1;
        }
        if (pageNum < 1) {
            throw {
                statusCode: 400,
                message: "Invalid negative page number argument",
            };
        }
        const foundJobs = await jobCollection.getAllJobs(nannyId, pageNum);
        return res.json(foundJobs);
    } catch (e) {
        if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        } else {
            return res.status(500).json({ title: "Error", message: "Some Error Occured" });
        }
    }
});

router.route("/searchJobs/:nannyId/:searchTerm/:pageNum").get(async (req, res) => {
    ///// Searching Applicants from Parent side
    let { pageNum, nannyId, searchTerm } = req.params;
    try {
        nannyId = await helpers.execValdnAndTrim(nannyId, "Job Id");
        if (typeof nannyId == "undefined") throw { statusCode: 400, message: "nannyId parameter not provided" };
        if (typeof nannyId !== "string") throw { statusCode: 400, message: "nannyId must be a string" };
        if (nannyId.trim().length === 0)
            throw {
                statusCode: 400,
                message: "jobIdd cannot be an empty string or just spaces",
            };
        if (!ObjectId.isValid(nannyId)) throw { statusCode: 400, message: "invalid object ID for job" };
        if (pageNum) {
            if (isNaN(pageNum)) {
                throw { statusCode: 400, message: "Invalid page number" };
            }
            ///// pageNo = parseInt(req.query.page)/////Check if it works with convert to int,if yes then do it
        } else {
            pageNum = 1;
        }
        if (pageNum < 1) {
            throw {
                statusCode: 400,
                message: "Invalid negative page number argument",
            };
        }
        const searchedApplicants = await jobCollection.searchJobsBasedOnZipCode(nannyId, searchTerm, pageNum);
        if (!searchedApplicants.jobsFound) {
            throw { statusCode: 400, message: "Couldn't get Jobs" };
        }

        return res.json(searchedApplicants);
    } catch (e) {
        if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        } else {
            return res.status(500).json({ title: "Error", message: "Some Error Occured" });
        }
    }
});

router.route("/applications/myApplications/appliedJobs/:nannyId").get(async (req, res) => {
    // Searching Applicants from Parent side
    let { nannyId } = req.params;
    try {
        const searchedApplicants = await jobCollection.findMyAppliedJobs(nannyId);
        if (!searchedApplicants) {
            throw "Couldn't get applications";
        }
        return res.json(searchedApplicants);
    } catch (e) {
        if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        } else {
            return res.status(500).json({ title: "Error", message: "Some Error Occured" });
        }
    }
});

router.route("/findjob/:childId").get(async (req, res) => {
    let childId = req.params.childId;
    try {
        const jobWithChildId = await jobCollection.getJobByChildId(childId);
        if (!jobWithChildId) {
            throw "Couldn't get jobId";
        }
        return res.json(jobWithChildId);
    } catch (e) {
        if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        } else {
            return res.status(500).json({ title: "Error", message: "Some Error Occured" });
        }
    }
});

router.route("/fireNanny/:childId").delete(async (req, res) => {
    const childId = req.params.childId;
    const nannyId = req.body.nannyId;

    try {
        await helpers.execValdnAndTrim(childId, "Child Id");
        if (!ObjectId.isValid(childId)) {
            throw { statusCode: 400, message: "Child Id is not valid" };
        }
        await helpers.execValdnAndTrim(nannyId, "Nanny Id");
        if (!ObjectId.isValid(nannyId)) {
            throw { statusCode: 400, message: "Nanny Id is not valid" };
        }
    } catch (e) {
        if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        } else {
            return res.status(500).json({ title: "Error", message: "Some Error Occured" });
        }
    }
    try {
        const removeNannyFrmUser = await jobCollection.removeNannyFromUser(nannyId, childId.toString());
        const removeNannyFrmJob = await jobCollection.removeNannyFromJob(nannyId);
        if (!removeNannyFrmJob.acknowledged || removeNannyFrmJob.modifiedCount == 0)
            throw {
                statusCode: 400,
                message: "Couldn't set nanny id null from job collection",
            };

        if (!removeNannyFrmUser.acknowledged || removeNannyFrmUser.modifiedCount == 0)
            throw {
                statusCode: 400,
                message: "Couldn't update nanny child from user collection",
            };
        return res.status(200).json(removeNannyFrmJob);
    } catch (e) {
        if (e.statusCode !== "" && e.statusCode !== undefined && e.statusCode !== null) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        } else {
            return res.status(500).json({ title: "Error", message: "Some Error Occured" });
        }
    }
});

module.exports = router;
