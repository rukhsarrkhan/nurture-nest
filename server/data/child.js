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
  childId = await helper.execValdnAndTrim(childId, "Child Id");
  if (!ObjectId.isValid(childId)) {
    throw { statusCode: 400, message: "Child Id is not valid" };
  }
  name = await helper.execValdnAndTrim(name, "name")
  await helper.onlyLettersNumbersAndSpaces(name, "name")

  date = await helper.execValdnAndTrim(date, 'date')
  await helper.isDateValid(date, "Date")
  doses = await helper.execValdnAndTrim(doses, 'Doses')
 await helper.onlyNumbers(doses, 'doses')


  let vaccineId = new ObjectId();

  let newVaccine = {
    _id: vaccineId,
    name: name,
    date: date,
    doses: doses,

  }

  const childCollection = await childs();
  const vaccineList = await childCollection.updateOne({ _id: ObjectId(childId) }, { $push: { vaccine: newVaccine } })
  if (!vaccineList.acknowledged || vaccineList.modifiedCount !== 1) throw { statusCode: 500, message: "Could not add vaccine" };


  const updatedChild = await getChildById(childId);
  return updatedChild.vaccine;

}

const getVaccines = async (childId) => {
  childId = await helper.execValdnAndTrim(childId, "Child Id");
  if (!ObjectId.isValid(childId)) {
    throw { statusCode: 400, message: "Child Id is not valid" };
  }
  const childCollection = await childs();
  const childFound = await childCollection.findOne({ _id: ObjectId(childId) });
  if (childFound === null) throw "No child with that Id";
  const childvaccines = childFound.vaccine
  return childvaccines;
};

const getAppointments = async (childId) => {
  childId = await helper.execValdnAndTrim(childId, "Child Id");
  if (!ObjectId.isValid(childId)) {
    throw { statusCode: 400, message: "Child Id is not valid" };
  }

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
  childId = await helper.execValdnAndTrim(childId, "Child Id");
  if (!ObjectId.isValid(childId)) {
    throw { statusCode: 400, message: "Child Id is not valid" };
  }
  doctor = await helper.execValdnAndTrim(doctor, "doctor")
  await helper.onlyLettersNumbersAndSpaces(doctor, "doctor")

  hospital = await helper.execValdnAndTrim(hospital, "hospital")
 await helper.onlyLettersNumbersAndSpaces(hospital, "hospital")

  date = await helper.execValdnAndTrim(date, 'date')
  await helper.isDateValid(date, "Date")


  let appointmentId = new ObjectId();
  let newAppointment = {
    _id: appointmentId,
    doctor: doctor,
    hospital: hospital,
    date: date,
    time: time
  }
  const childCollection = await childs();
  const appointmentList = await childCollection.updateOne({ _id: ObjectId(childId) }, { $push: { appointments: newAppointment } })
  if (!appointmentList.acknowledged || appointmentList.modifiedCount !== 1) throw { statusCode: 500, message: "Could not add appointment" };

  const updatedChild = await getChildById(childId);
  return updatedChild.appointments;

}
const removeVaccine = async (vaccineId) => {
  vaccineId = await helper.execValdnAndTrim(vaccineId, "Child Id");
  if (!ObjectId.isValid(vaccineId)) {
    throw { statusCode: 400, message: "Vaccine Id is not valid" };
  }

  const childCollection = await childs();
  const vaccine = await childCollection.findOne({ vaccine: { $elemMatch: { _id: ObjectId(vaccineId) } }, },
    { projection: { _id: 1, vaccine: { $elemMatch: { _id: ObjectId(vaccineId) } }, }, }
  );

  if (vaccine !== null) {
    const postVaccine = vaccine._id
    const remVaccine = await childCollection.updateOne({ _id: postVaccine }, { $pull: { vaccine: { _id: ObjectId(vaccineId) } } });
    return remVaccine
  } else {
    throw 'Vaccine does not exist'
  }


};

const removeAppointment = async (appointmentId) => {
  appointmentId = await helper.execValdnAndTrim(appointmentId, "Child Id");
  if (!ObjectId.isValid(appointmentId)) {
    throw { statusCode: 400, message: "Appointment Id is not valid" };
  }


  const childCollection = await childs();
  const appointment = await childCollection.findOne({ appointments: { $elemMatch: { _id: ObjectId(appointmentId) } }, },
    { projection: { _id: 1, appointments: { $elemMatch: { _id: ObjectId(appointmentId) } }, }, }
  );

  if (appointment !== null) {
    const postAppointment = appointment._id
    const remAppointment = await childCollection.updateOne({ _id: postAppointment }, { $pull: { appointments: { _id: ObjectId(appointmentId) } } });
    return remAppointment
  } else {
    throw 'Appointment does not exist'
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
