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
  if (!insertedChild.acknowledged || !insertedChild.insertedId)
    throw "Could not add User";
  const child = await getChildById(insertedChild.insertedId.toString());
  return child;
};

const getChildById = async (childId) => {
  // if (typeof childId == "undefined")
  //   throw "childId parameter not provchildIded";
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
  name,
  date,
  doses,
  childId
) => {
  // if (!childId) throw 'You must provide a childId to add a vaccine';
  // if (typeof childId !== 'string') throw 'childId must be a string';
  // if (childId.trim().length === 0)
  //     throw 'childId cannot be an empty string or just spaces';
  // childId = childId.trim();
  // if (!ObjectId.isValid(childId)) throw 'invalid object ID';

  let vaccineId = new ObjectId();

  let newVaccine = {
    _id: vaccineId,
  name: name, 
  date: date,
  doses: doses,
  
  }

  const childCollection = await childs();
  const tempChild = await getChildById(childId);
      const vaccineList = await childCollection.updateOne({ _id: ObjectId(childId) }, { $push: { vaccine: newVaccine } })
 
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
  doctor,
  hospital,
  date,
  time,
  childId
) => {
  helper.validateInput(childId,"child Id")
  helper.onlyLettersNumbersAndSpaces(childId, "child Id")
  helper.isIdValid(childId)
  helper.onlyLettersNumbersAndSpaces(doctor, "Doctor")
  helper.onlyLettersNumbersAndSpaces(hospital, "Doctor")
   await helper.isDateValid(date, "date")
// await helper.isTimeValid(appointment.time)

let appointmentId = new ObjectId();
let newAppointment = {
  _id: appointmentId,
doctor: doctor, 
hospital: hospital,
date: date,
time: time
}
  const childCollection = await childs();
  const tempChild = await getChildById(childId);
      const vaccineList = await childCollection.updateOne({ _id: ObjectId(childId) }, { $push: {appointments : newAppointment } })
 
  const updatedChild = await getChildById(childId);
  return updatedChild.appointments;

}
const removeVaccine = async (vaccineId) => {
  // if (typeof childId == "undefined") throw "Id parameter not provided";
  // if (typeof childId !== "string") throw "Id must be a string";
  // if (childId.trim().length === 0)
  //   throw "id cannot be an empty string or just spaces";
  // childId = childId.trim();
  // if (!ObjectId.isValid(childId)) throw "invalid object ID";

   const childCollection = await childs();
   const vaccine = await childCollection.findOne({ vaccine: { $elemMatch: { _id: ObjectId(vaccineId) } }, },
   { projection: { _id: 1, vaccine: { $elemMatch: { _id: ObjectId(vaccineId) } }, }, }
 );
 console.log("vaccine",vaccine)
 if (vaccine !== null){
  const postVaccine= vaccine._id
  const remVaccine = await childCollection.updateOne({ _id: postVaccine }, { $pull: { vaccine: { _id: ObjectId(vaccineId) } } });
  return remVaccine
 } else {
  return null
 }


};

const removeAppointment = async (appointmentId) => {
  // if (typeof childId == "undefined") throw "Id parameter not provided";
  // if (typeof childId !== "string") throw "Id must be a string";
  // if (childId.trim().length === 0)
  //   throw "id cannot be an empty string or just spaces";
  // childId = childId.trim();
  // if (!ObjectId.isValid(childId)) throw "invalid object ID";

   const childCollection = await childs();
   const appointment = await childCollection.findOne({ appointments: { $elemMatch: { _id: ObjectId(appointmentId) } }, },
   { projection: { _id: 1, appointments: { $elemMatch: { _id: ObjectId(appointmentId) } }, }, }
 );

 if (appointment !== null){
  const postAppointment= appointment._id
  const remAppointment = await childCollection.updateOne({ _id: postAppointment }, { $pull: { appointments: { _id: ObjectId(appointmentId) } } });
  return remAppointment
 } else {
  return null
 }


};


module.exports = {
  createChild,
  getChildById,
  updateChild,
  removeChild,
  addVaccine,
  getVaccines,
  getAppointments,
  addAppointment,
  removeVaccine,
  removeAppointment
};
