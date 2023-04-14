const mongoCollections = require("../config/mongo-collections");
const childs = mongoCollections.child;
const { ObjectId } = require("mongodb");
const helper = require('../helpers')


const createChild = async (
  name,
  age,
  sex,
  jobId,
  mealRequirements,
  vaccine,
  nannyId,
  appointments
) => {
  let newChild = {
    name: name,
    age: age,
    sex: sex,
    jobId: jobId,
    mealRequirements: mealRequirements,
    vaccine: vaccine,
    nannyId: nannyId,
    appointments: appointments,
  };
  const childCollection = await childs();
  const insertedChild = await childCollection.insertOne(newChild);
  if(age > 7 ) throw "Child cannot be more than 7 years old"
  if (!insertedChild.acknowledged || !insertedChild.insertedId)
    throw "Could not add User";
  const child = await getChildById(insertedChild.insertedId.toString());
  return child;
};

const getChildById = async (childId) => {
  if (typeof childId == "undefined")
    throw "childId parameter not provchildIded";
  if (typeof childId !== "string") throw "childId must be a string";
  if (childId.trim().length === 0) {
    throw "childId cannot be an empty string or just spaces";
  }
  childId = childId.trim();
  if (!ObjectId.isValid(childId)) throw "invalid object id";
  const childCollection = await childs();
  const childFound = await childCollection.findOne({ _id: ObjectId(childId) });
  if (childFound === null) throw "No child with that Id";
  childFound._id = childFound._id.toString();
  return childFound;
};

const updateChild = async (
  childId,
  name,
  age,
  sex,
  jobId,
  mealRequirements,
  vaccine,
  nannyId,
  appointments
) => {
  let editedChild = {
    name: name,
    age: age,
    sex: sex,
    jobId: jobId,
    mealRequirements: mealRequirements,
    vaccine: vaccine,
    nannyId: nannyId,
    appointments: appointments,
  };
  const childCollection = await childs();
  const updatedChild = await childCollection.replaceOne(
    { _id: ObjectId(childId) },
    editedChild
  );
  if (!updatedChild.acknowledged || updatedChild.modifiedCount == 0)
    throw "Couldn't update child";
  const child = await getChildById(childId);
  return child;
};

const removeChild = async (childId) => {
  if (typeof childId == "undefined") throw "Id parameter not provided";
  if (typeof childId !== "string") throw "Id must be a string";
  if (childId.trim().length === 0)
    throw "id cannot be an empty string or just spaces";
  childId = childId.trim();
  if (!ObjectId.isValid(childId)) throw "invalid object ID";
  const childCollection = await childs();
  const deletedChild = await childCollection.findOneAndDelete({
    _id: ObjectId(childId),
  });
  if (deletedChild.value == null) {
    throw `Could not delete child with id of ${childId}`;
  }
  deletedChild.value._id = deletedChild.value._id.toString();
  return `${deletedChild.value.name} has been successfully deleted!`;
};

const addVaccine = async (
  vaccines,
  childId
) => {
  if (!childId) throw 'You must provide a childId to add a vaccine';
  if (typeof childId !== 'string') throw 'childId must be a string';
  if (childId.trim().length === 0)
      throw 'childId cannot be an empty string or just spaces';
  childId = childId.trim();
  if (!ObjectId.isValid(childId)) throw 'invalid object ID';


  const childCollection = await childs();
  const tempChild = await getChildById(childId);
      const vaccineList = await childCollection.updateOne({ _id: ObjectId(childId) }, { $push: { vaccine: vaccines } })
 
  const updatedChild = await getChildById(childId);
  return updatedChild.vaccine;

}

const getVaccines = async (childId) => {
  if (typeof childId == "undefined")
    throw "childId parameter not provchildIded";
  if (typeof childId !== "string") throw "childId must be a string";
  if (childId.trim().length === 0) {
    throw "childId cannot be an empty string or just spaces";
  }

  childId = childId.trim();
  // if (!ObjectId.isValid(childId)) throw "invalid object id";
  const childCollection = await childs();
  const childFound = await childCollection.findOne({ _id: ObjectId(childId) });
  if (childFound === null) throw "No child with that Id";
  const childvaccines = childFound.vaccine
  return childvaccines;
};

const getAppointments = async (childId) => {
  // if (typeof childId == "undefined")
  //   throw "childId parameter not provchildIded";
  // if (typeof childId !== "string") throw "childId must be a string";
  // if (childId.trim().length === 0) {
  //   throw "childId cannot be an empty string or just spaces";
  // }

  childId = childId.trim();
  // if (!ObjectId.isValid(childId)) throw "invalid object id";
  const childCollection = await childs();
  const childFound = await childCollection.findOne({ _id: ObjectId(childId) });
  if (childFound === null) throw "No child with that Id";
  const childAppointments = childFound.appointments
  return childAppointments;
};


const addAppointment = async (
  appointment,
  childId
) => {
  if (!childId) throw 'You must provide a childId to add a vaccine';
  if (typeof childId !== 'string') throw 'childId must be a string';
  if (childId.trim().length === 0)
      throw 'childId cannot be an empty string or just spaces';
  childId = childId.trim();
  if (!ObjectId.isValid(childId)) throw 'invalid object ID';


  const childCollection = await childs();
  const tempChild = await getChildById(childId);
      const vaccineList = await childCollection.updateOne({ _id: ObjectId(childId) }, { $push: {appointments : appointment } })
 
  const updatedChild = await getChildById(childId);
  return updatedChild.appointments;

}


module.exports = {
  createChild,
  getChildById,
  updateChild,
  removeChild,
  addVaccine,
  getVaccines,
  getAppointments,
  addAppointment
};
