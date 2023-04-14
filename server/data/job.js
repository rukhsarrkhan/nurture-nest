const mongoCollections = require("../config/mongo-collections");
const jobs = mongoCollections.job;
const {ObjectId} = require('mongodb');

  const createJob = async (shifts, description, address, specialCare, salary) => {
    let newJob = { shifts, description, address, specialCare, salary };
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

  module.exports = {
    createJob,
    getJobById,
    updateJob,
    removeJob
  };