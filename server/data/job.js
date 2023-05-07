const mongoCollections = require("../config/mongo-collections");
const childs = mongoCollections.child;
const users = mongoCollections.users;
const jobs = mongoCollections.job;
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");
const childData = require("./child");
const userData = require("./users");

const assignJobToChild = async (childId, jobId) => {
  childId = await helpers.execValdnAndTrim(childId, "Child Id");
  if (!ObjectId.isValid(childId))
    throw { statusCode: 400, message: "invalid object ID for Child" };
  jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
  if (!ObjectId.isValid(jobId))
    throw { statusCode: 400, message: "invalid object ID for Job" };

  const childCollection = await childs();
  const updatedChild = await childCollection.updateOne(
    { _id: ObjectId(childId) },
    { $set: { jobId: ObjectId(jobId) } }
  );
  if (!updatedChild.acknowledged || updatedChild.modifiedCount == 0)
    throw {
      statusCode: 400,
      message: "Couldn't update child after creating Job",
    };
  return { childId: updatedChild.upsertedId };
};

const removeJobFromChild = async (childId) => {
  childId = await helpers.execValdnAndTrim(childId, "Child Id");
  if (!ObjectId.isValid(childId))
    throw { statusCode: 400, message: "invalid object ID for Child" };
  //should I check if child already had jobId null? But that willl never happen unless someone manually tampers with the child collection in DB
  const childCollection = await childs();
  const updatedChild = await childCollection.updateOne(
    { _id: ObjectId(childId) },
    { $set: { jobId: null } }
  );
  if (!updatedChild.acknowledged || updatedChild.modifiedCount == 0)
    throw {
      statusCode: 400,
      message: "Couldn't update child after creating Job",
    };
  return { childId: updatedChild.upsertedId };
};

const getUserById = async (parentId) => {
  if (typeof parentId == "undefined")
    throw { statusCode: 400, message: "Parent Id parameter not provided" };
  if (typeof parentId !== "string")
    throw { statusCode: 400, message: "Parent Id must be a string" };
  if (parentId.trim().length === 0)
    throw {
      statusCode: 400,
      message: "Parent Id cannot be an empty string or just spaces",
    };
  parentId = parentId.trim();
  if (!ObjectId.isValid(parentId))
    throw { statusCode: 400, message: "Invalid object ID for Parent" };

  const userCollection = await users();
  const userFound = await userCollection
    .find({ _id: ObjectId(parentId) })
    .toArray();

  if (userFound === null)
    throw { statusCode: 400, message: "No Parent with that id" };
  // userFound = userFound[0]
  userFound[0]["_id"] = userFound[0]["_id"].toString();

  return userFound;
};

const createJob = async (
  parentId,
  childId,
  shifts,
  description,
  address,
  specialCare,
  state,
  zipCode,
  salary
) => {
  // Validations

  parentId = await helpers.execValdnAndTrim(parentId, "Parent Id");
  if (!ObjectId.isValid(parentId))
    throw { statusCode: 400, message: "invalid object ID for Parent" };
  childId = await helpers.execValdnAndTrim(childId, "Child Id");
  if (!ObjectId.isValid(childId))
    throw { statusCode: 400, message: "invalid object ID for Child" };
  await helpers.isDateValid(
    shifts.timeFrom.toLocaleString(),
    "Shift Timing from"
  );
  await helpers.isDateValid(shifts.timeTo.toLocaleString(), "Shift Timing to");
  await helpers.isTime1BeforeTime2(shifts.timeFrom, shifts.timeTo);
  shifts.days = await helpers.execValdnForArr(shifts.days, "Shift-Days");
  shifts.days.map((day) => {
    if (
      ![
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].includes(day)
    ) {
      throw {
        statusCode: 400,
        message: `Shift-Days field contains a invalid day value selected`,
      };
    }
  });
  await helpers.isShiftLimitValid(
    shifts.timeFrom.toLocaleString(),
    shifts.timeTo.toLocaleString(),
    shifts.days.length
  );
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

  const parent = await getUserById(parentId);
  if (!parent[0].p_childIds.includes(childId)) {
    throw {
      statusCode: 400,
      message: `Incorrect child and parent combination`,
    };
  }
  const child = await childData.getChildById(childId);
  console.log(child);
  if (child.jobId) {
    throw {
      statusCode: 400,
      message: `Job already exists for the child.Please remove the current job to create new Job`,
    };
  }

  // Add child of parent Validation
  let newJob = {
    parentId: ObjectId(parentId),
    childId: ObjectId(childId),
    nannyId: null,
    shifts,
    description,
    address,
    specialCare,
    state,
    zipCode,
    salary,
    applications: [],
  };
  const jobCollection = await jobs();
  const insertedJob = await jobCollection.insertOne(newJob);
  if (!insertedJob.acknowledged || !insertedJob.insertedId) {
    throw { statusCode: 500, message: `Couldn't Create Job` };
  }
  const job = await getJobById(insertedJob.insertedId.toString());
  return job;
};

const getMyJob = async (jobId) => {
  if (typeof jobId == "undefined")
    throw { statusCode: 400, message: "jobId parameter not provided" };
  if (typeof jobId !== "string")
    throw { statusCode: 400, message: "jobId must be a string" };
  if (jobId.trim().length === 0)
    throw {
      statusCode: 400,
      message: "jobIdd cannot be an empty string or just spaces",
    };
  jobId = jobId.trim();
  if (!ObjectId.isValid(jobId))
    throw { statusCode: 400, message: "invalid object ID" };
  const jobCollection = await jobs();
  let myJob = await jobCollection.findOne(
    { _id: ObjectId(jobId) },
    { projection: { applications: 0 } }
  );
  if (myJob === null) throw { statusCode: 400, message: "No Job with that id" };
  myJob._id = myJob._id.toString();
  console.log(myJob);
  return myJob;
};

const getJobById = async (jobId) => {
  if (typeof jobId == "undefined")
    throw { statusCode: 400, message: "jobId parameter not provjobIded" };
  if (typeof jobId !== "string")
    throw { statusCode: 400, message: "jobId must be a string" };
  if (jobId.trim().length === 0)
    throw {
      statusCode: 400,
      message: "jobId cannot be an empty string or just spaces",
    };
  jobId = jobId.trim();
  if (!ObjectId.isValid(jobId)) throw "invalid object ID";
  const jobCollection = await jobs();
  console.log("holaa inside", jobId);
  const jobFound = await jobCollection.findOne({ _id: ObjectId(jobId) });
  if (jobFound === null) throw "No job with that id";
  jobFound._id = jobFound._id.toString();
  return jobFound;
};

const updateJob = async () => { };

const removeJob = async (jobId) => {
  console.log("inside data");
  if (typeof jobId == "undefined")
    throw { statusCode: 400, message: "jobId parameter not provided" };
  if (typeof jobId !== "string")
    throw { statusCode: 400, message: "jobId must be a string" };
  if (jobId.trim().length === 0)
    throw {
      statusCode: 400,
      message: "jobIdd cannot be an empty string or just spaces",
    };
  jobId = jobId.trim();
  if (!ObjectId.isValid(jobId))
    throw { statusCode: 400, message: "invalid object ID" };
  // Should I keep this validation that I've done below
  console.log("hgfdn");
  const jobInDB = await getJobById(jobId);
  console.log("idharrr", jobInDB);
  if (jobInDB.nannyId != null)
    throw {
      statusCode: 400,
      message:
        "Job Cannot be deleted. Please fire the nanny assigned to this job first to delete this job",
    };
  const jobCollection = await jobs();
  const deletionInfo = await jobCollection.findOneAndDelete({
    _id: ObjectId(jobId),
  });
  if (deletionInfo.value == null) {
    throw { statusCode: 500, message: `Could not delete Job with id of ${id}` };
  }
  deletionInfo.value._id = deletionInfo.value._id.toString();
  return deletionInfo.value;
};

const getAllApplicants = async (jobId, pageNum) => {
  console.log(jobId, pageNum, "inside data see");
  if (typeof jobId == "undefined")
    throw { statusCode: 400, message: "jobId parameter not provided" };
  if (typeof jobId !== "string")
    throw { statusCode: 400, message: "jobId must be a string" };
  if (jobId.trim().length === 0)
    throw {
      statusCode: 400,
      message: "jobIdd cannot be an empty string or just spaces",
    };
  jobId = jobId.trim();
  if (!ObjectId.isValid(jobId))
    throw { statusCode: 400, message: "invalid object ID" };
  const jobCollection = await jobs();
  console.log("hereeee before query");
  let allApplications = await jobCollection
    .aggregate([
      { $match: { _id: ObjectId(jobId) } },
      { $unwind: "$applications" },
      { $group: { _id: null, applications: { $push: "$applications" } } },
    ])
    .toArray();
  console.log(allApplications, "this was for all applications");
  console.log("-----------------------");
  if (allApplications === null)
    throw { statusCode: 400, message: "No applications till now" };
  allApplications = allApplications[0]["applications"];
  console.log(allApplications, "--------------------");
  for (let i in allApplications) {
    console.log(allApplications[i]);
    allApplications[i]["nannyId"] = allApplications[i]["nannyId"].toString();
  }
  return allApplications;
};

const addApplication = async (
  jobId,
  nannyId,
  nannyName,
  contact,
  city,
  state,
  zipCode,
  distance,
  nannyAddress,
  whySelect,
  disability,
  shiftPuntuality,
  experience,
  attachment
) => {
  console.log("idhaaarr");
  ////////////Params validation
  jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
  if (!ObjectId.isValid(jobId))
    throw { statusCode: 400, message: "invalid object ID for Job" };
  nannyId = await helpers.execValdnAndTrim(nannyId, "Nanny Id");
  if (!ObjectId.isValid(nannyId))
    throw { statusCode: 400, message: "invalid object ID for Nanny" };
  /////////////
  //////////Validations
  nannyName = await helpers.execValdnAndTrim(nannyName, "Nanny Name");
  await helpers.isNameValid(nannyName, "Nanny Name");
  contact = await helpers.execValdnAndTrim(contact, "Phone Number");
  await helpers.validatePhoneNumber(contact, "Phone Number");
  nannyAddress = await helpers.isAddressParentValid(
    nannyAddress,
    "Nanny Address"
  );
  await helpers.isNameValid(nannyAddress, "Nanny Address");
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
  if (description) {
    description = description.trim();
  }
  if (disability) {
    disability = disability.trim();
  }
  if (experience) {
    experience = experience.trim();
  }
  if (coverLetter) {
    attachment = attachment.trim();
  }
  ///////////////
  let newApplication = {
    _id: ObjectId(),
    nannyId: ObjectId(nannyId),
    nannyName: nannyName,
    contact: contact,
    city: city,
    state: state,
    zipCode: zipCode,
    distance: distance,
    nannyAddress: nannyAddress,
    whySelect: whySelect,
    disability: disability,
    shiftPuntuality: shiftPuntuality,
    experience: experience,
    attachment: attachment,
    applyDate: new Date(),
  };
  console.log("idhaaarr");
  const jobCollection = await jobs();
  const applicationCreated = await jobCollection.updateOne(
    { _id: ObjectId(jobId) },
    { $push: { applications: newApplication } }
  );
  if (applicationCreated.modifiedCount === 0) {
    throw {
      statusCode: 500,
      message: "could not create application successfully",
    };
  }
  const job = await getJobById(jobId);
  job["_id"] = job["_id"].toString();
  return job;
};

const searchApplications = async (jobId, searchTerm, pageNum) => {
    console.log("Inside search dataFunction");
    if (typeof jobId == "undefined")
      throw { statusCode: 400, message: "jobId parameter not provided" };
    if (typeof jobId !== "string")
      throw { statusCode: 400, message: "jobId must be a string" };
    if (jobId.trim().length === 0)
      throw {
        statusCode: 400,
        message: "jobId cannot be an empty string or just spaces",
      };
    jobId = jobId.trim();
    if (!ObjectId.isValid(jobId))
      throw { statusCode: 400, message: "invalid object ID" };
    const jobCollection = await jobs();
    let nanniesFound = await jobCollection
      .aggregate([
        { $match: { _id: ObjectId(jobId) } },
        { $unwind: "$applications" },
        {
          $match: {
            "applications.nannyName": { $regex: searchTerm, $options: "i" },
          },
        },
        { $skip: (pageNum - 1) * 5 },
        { $limit: 5 },
        { $group: { _id: null, applications: { $push: "$applications" } } },
      ])
      .toArray();
    if (nanniesFound === null)
      throw { statusCode: 500, message: "No applications with that search term" };
    nanniesFound = nanniesFound[0]?.applications;
    return nanniesFound;
};

const setNannytoJob = async (jobId, nannyId) => {
    jobId = await helpers.execValdnAndTrim(jobId, "Job Id");
    if (typeof jobId == "undefined")
      throw { statusCode: 400, message: "jobId parameter not provided" };
    if (typeof jobId !== "string")
      throw { statusCode: 400, message: "jobId must be a string" };
    if (jobId.trim().length === 0)
      throw {
        statusCode: 400,
        message: "jobIdd cannot be an empty string or just spaces",
      };
    if (!ObjectId.isValid(jobId))
      throw { statusCode: 400, message: "invalid object ID for job" };
    nannyId = await helpers.execValdnAndTrim(nannyId, "Job Id");
    if (typeof nannyId == "undefined")
      throw { statusCode: 400, message: "nannyId parameter not provided" };
    if (typeof nannyId !== "string")
      throw { statusCode: 400, message: "nannyId must be a string" };
    if (nannyId.trim().length === 0)
      throw {
        statusCode: 400,
        message: "nannyId cannot be an empty string or just spaces",
      };
    if (!ObjectId.isValid(nannyId))
      throw { statusCode: 400, message: "invalid object ID for Nanny" };
    //Validations Done
    const jobCollection = await jobs();
    console.log(jobId, nannyId, "before mongo query");
    let jobUpdated = await jobCollection.updateOne(
      { _id: ObjectId(jobId) },
      { $set: { nannyId: ObjectId(nannyId) } }
    );
    if (!jobUpdated.acknowledged || jobUpdated.modifiedCount == 0)
      throw {
        statusCode: 500,
        message: `Could not update and set nanny to Job with jobId of ${jobId} and nannyId of ${nannyId}`,
      };
    console.log("This was jobUpdated _id:", jobUpdated.upsertedId);
    const job = await getJobById(jobId);
    job["_id"] = job["_id"].toString();
    return job;
  };
  //////////////////////////////////////////////////////
  const getAllJobs = async (pageNum) => {
    if (pageNum) {
      if (isNaN(pageNum)) {
        throw { statusCode: 400, message: "Invalid page number argument" };
      }
      // pageNo = parseInt(req.query.page)/////Check if it works with convrt to int,if yes then do it
    } else {
      pageNum = 1;
    }
    console.log("Inside getAllJobs dataFunction", pageNum);
    const jobCollection = await jobs();
    let nanniesFound = await jobCollection
      .find({}, { projection: { applications: 0 } })
      .skip(pageNum > 0 ? (pageNum - 1) * 5 : 0)
      .limit(5)
      .toArray();
    console.log("This was found for getAllJobs: ", nanniesFound);
    if (nanniesFound === null)
      throw { statusCode: 500, message: "No applications with that search term" };
    return nanniesFound;
  };
  
  const searchJobsBasedOnCity = async (searchTerm, pageNum) => {
    console.log("Inside search Job dataFunction");
    if (pageNum) {
      if (isNaN(pageNum)) {
        throw { statusCode: 400, message: "Invalid page number argument" };
      }
      // pageNo = parseInt(req.query.page)/////Check if it works with convrt to int,if yes then do it
    } else {
      pageNum = 1;
    }
    if (pageNum < 1) {
      throw { statusCode: 400, message: "Invalid negative page number argument" };
    }
    const jobCollection = await jobs();
    let nanniesFound = await jobCollection
      .find(
        { city: { $regex: searchTerm, $options: "i" } },
        { projection: { applications: 0 } }
      )
      .skip(pageNum > 0 ? (pageNum - 1) * 5 : 0)
      .limit(5)
      .toArray();
    if (nanniesFound === null)
      throw { statusCode: 500, message: "No applications with that search term" };
    return nanniesFound;
  };

const findMyAppliedJobs = async (nannyId) => {
  console.log("Inside myAppliedJobs dataFunction", nannyId);
  const jobCollection = await jobs();
  // let nanniesFound = await jobCollection.find(
  //   { state: {$regex:searchTerm,$options:'i'} },
  //   { projection: { applications: 0 } }
  // ).toArray();
  let nanniesFound = await jobCollection
    .aggregate([
      { $unwind: "$applications" },
      { $match: { "applications.nannyId": ObjectId(nannyId) } },
    ])
    .toArray();
  console.log("This was queried for myJobApplications: ", nanniesFound);
  if (nanniesFound === null)
    throw { statusCode: 500, message: "No applications with that search term" };
  // nanniesFound = nanniesFound[0].applications
  // nanniesFound._id = nanniesFound._id.toString();
  return nanniesFound;
};

const getJobByChildId = async (childId) => {
  childId = await helpers.execValdnAndTrim(childId, "Child Id");
  if (!ObjectId.isValid(childId)) throw { statusCode: 400, message: "invalid object ID for Child" };
  const jobCollection = await jobs();
  let jobFound = await jobCollection.findOne({ childId: ObjectId(childId) });
  let nannyId = jobFound.nannyId.toString();
  let nannyFromApplicants = null;
  let applicantData = jobFound.applications;
  for (let i in applicantData) {
    if (applicantData[i].nannyId.toString() == nannyId) {
      nannyFromApplicants = applicantData[i];
    }
  }
  if (nannyFromApplicants === null) throw { statusCode: 400, message: "No job found with that id" };
  nannyFromApplicants["_id"] = nannyFromApplicants["_id"].toString();
  return nannyFromApplicants;
};

// const fireNanny = async (nannyId) => {

//       const userCollection = await users();
//       const jobCollection = await jobs();

//       const removeNannyFromJobCollection = await jobCollection.updateOne({ nannyId: ObjectId(nannyId) }, { $set: { nannyId: null } },
//       {
//         projection: {
//             childId: 1
//         },
//     }
//       );


//       if (deletedNanny.value == null) throw  { statusCode: 500, message:`Could not delete nanny with id of ${nannyId}`};
//       deletedNanny.value._id = deletedNanny.value._id.toString();
//       return `${deletedNanny.value.name} has been successfully deleted!`;
//   };


module.exports = {
  createJob,
  getJobById,
  updateJob,
  removeJob,
  getAllApplicants,
  addApplication,
  searchApplications,
  assignJobToChild,
  removeJobFromChild,
  setNannytoJob,
  getMyJob,
  getAllJobs,
  searchJobsBasedOnCity,
  findMyAppliedJobs,
  getJobByChildId
};
