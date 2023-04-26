const mongoCollections = require("../config/mongo-collections");
const jobs = mongoCollections.job;
const {ObjectId} = require('mongodb');
const helpers =  require('../helpers');
const childData = require('./child');
const userData = require('./users');

  const createJob = async (parentId, childId, shifts, description, address, specialCare, state, zipCode, salary) => {
    // Validations

    if (!ObjectId.isValid(childId)) throw { statusCode: 400, message: "invalid object ID for childId" };
    if (!ObjectId.isValid(parentId)) throw { statusCode: 400, message: "invalid object ID for parentId" };
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
    console.log("validations doneeee heree")
    
    const parent = userData.getUserById(parentId)
    if(!parent.p_childIds.includes(childId)){throw { statusCode: 400, message: `Incorrect child and parent combination` }}
    const child = childData.getChildById(childId)
    if(child.jobId){ throw { statusCode: 400, message: `Job already exists for the child.Please remove the current job to create new Job` }}

    // Add child of parent Validation
    let newJob = {parentId:ObjectId(parentId), childId:ObjectId(childId), shifts, description, address, specialCare, state, zipCode, salary, applications:[] };
    const jobCollection = await jobs();
    const insertedJob = await jobCollection.insertOne(newJob);
    if (!insertedJob.acknowledged || !insertedJob.insertedId) {  throw { statusCode: 500, message: `Couldn't Create Job` }; };
    const job = await getJobById(insertedJob.insertedId.toString());
    return job;
  };

  const getJobById = async (jobId) => {
    if (typeof jobId=="undefined") throw "jobId parameter not provjobIded";
    if (typeof jobId !== "string") throw "jobId must be a string";
    if (jobId.trim().length === 0){throw "jobId cannot be an empty string or just spaces"};
    jobId = jobId.trim();
    if (!ObjectId.isValid(jobId)) throw "invalid object ID";
    const jobCollection = await jobs();
    const jobFound = await jobCollection.findOne({ _id: ObjectId(jobId) });
    if (jobFound === null) throw "No job with that id";
    jobFound._id = jobFound._id.toString();
    return jobFound;
  };

  const updateJob = async () => {
  };

  const removeJob = async (jobId) => {
    if (typeof jobId=="undefined") throw { statusCode: 400, message:"jobId parameter not provided" };
    if (typeof jobId !== "string") throw { statusCode: 400, message:"jobId must be a string"};
    if (jobId.trim().length === 0) throw { statusCode: 400, message:"jobIdd cannot be an empty string or just spaces"};
    jobId = jobId.trim();
    if (!ObjectId.isValid(jobId)) throw { statusCode: 400, message:"invalid object ID"};
    const jobCollection = await jobs();
    const deletionInfo = await jobCollection.findOneAndDelete({ _id: ObjectId(jobId) });
    if (deletionInfo.value == null){throw { statusCode: 500, message:`Could not delete Job with id of ${id}`}};
    deletionInfo.value._id = deletionInfo.value._id.toString()
    return deletionInfo.value;
  };


  const getAllApplicants = async (jobId) => {
    const jobCollection = await jobs();
      let allApplications = await jobCollection.findOne(
        { _id: ObjectId(jobId) },
        { projection: { _id: 0, applications: 1 } }
      );
      if (allApplications === null) throw "No applications with that id";
      allApplications = allApplications["applications"];
      for (let i in allApplications) {
        allApplications[i]["nannyId"] = allApplications[i]["nannyId"].toString();
      }   
      return allApplications;
  };

  const addApplication = async (jobId,nannyId,nannyName,distance,nannyAddress,whySelect,disability,shiftPuntuality,experience,attachment,expectedSalary) => {
    let newApplication = {
      _id:ObjectId(),
      nannyId:ObjectId(nannyId),
      nannyName:nannyName,
      distance:distance,
      nannyAddress:nannyAddress,
      whySelect:whySelect,
      disability:disability,
      shiftPuntuality:shiftPuntuality,
      experience:experience,
      attachment:attachment,
      expectedSalary:expectedSalary,
      applyDate: new Date()
    };
    const jobCollection = await jobs();
    const applicationCreated = await jobCollection.updateOne(
      { _id: ObjectId(jobId) },
      { $push: { applications: newApplication } }
    );
    if (applicationCreated.modifiedCount === 0) {throw "could not create application successfully"};
    const job = await getJobById(jobId);
    job["_id"] = job["_id"].toString();
    return job;
  };

  const searchApplications = async (jobId,searchTerm) => {
    if (typeof jobId=="undefined") throw "jobId parameter not provjobIded";
    if (typeof jobId !== "string") throw "jobId must be a string";
    if (jobId.trim().length === 0){throw "jobId cannot be an empty string or just spaces"};
    jobId = jobId.trim();
    if (!ObjectId.isValid(jobId)) throw "invalid object ID";
    const jobCollection = await jobs();
    // const nanniesFound = await jobCollection.find(
    //   {
    //     applications: {"$elemMatch": {nannyName: { "$regex": searchTerm, "$options": "i" }}},
    //   },
    //   {
    //     projection: {
    //       _id: 0,
    //       "applications.$": {"$elemMatch": {"nannyName": { "$regex": searchTerm, "$options": "i" }}},
    //     },
    //   }
    // ).toArray()
    const nanniesFound = await jobCollection.aggregate([
      {$unwind:'$applications'},
      {$match:{
        'applications.nannyName':{$regex:searchTerm,$options:'i'}
  }},{$group: {
    _id: null,
    applications: {
      $push: "$applications"
    }
  }}
]).toArray()
    console.log("This was queried for search : ",nanniesFound)
    if (nanniesFound === null) throw "No applications with that search term";
    // nanniesFound._id = nanniesFound._id.toString();
    return nanniesFound;
  };

  module.exports = {
    createJob,
    getJobById,
    updateJob,
    removeJob,
    getAllApplicants,
    addApplication,
    searchApplications
  };