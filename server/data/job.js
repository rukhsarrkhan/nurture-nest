const mongoCollections = require("../config/mongo-collections");
const jobs = mongoCollections.job;
const {ObjectId} = require('mongodb');

  const createJob = async (parentId, childId, shifts, description, address, specialCare, salary) => {
    let newJob = { shifts, description, address, specialCare, salary, applications:[] };
    const jobCollection = await jobs();
    const insertedJob = await jobCollection.insertOne(newJob);
    if (!insertedJob.acknowledged || !insertedJob.insertedId) throw "Could not add Job";
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

  const removeJob = async () => {
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
      expectedSalary:expectedSalary
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
    const nanniesFound = await jobCollection.find({_id:jobId,applications:{$elemMatch: { $regex: searchTerm , $options: "i" }}},{projection:{_id:0,applications:{$elemMatch: { $regex: searchTerm , $options: "i" }}}});
    console.log("This was queried for search : ",nanniesFound)
    if (nanniesFound === null) throw "No applications with that search term";
    nanniesFound._id = nanniesFound._id.toString();
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