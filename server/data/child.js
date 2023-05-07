const mongoCollections = require("../config/mongo-collections");
const childs = mongoCollections.child;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const helper = require("../helpers");

const createChild = async (photoUrl, name, age, sex, mealRequirementsArr, vaccineArr, appointmentsArr) => {
    name = await helper.execValdnAndTrim(name, "Name");
    await helper.isNameValid(name, "Name");
    age = await helper.execValdnAndTrim(age, "Age");
    if (isNaN(age)) {
        throw { statusCode: 400, message: `${fieldName} should be a number` };
    }
    if (age > 12) throw { statusCode: 400, message: "child cannnot be more than 12 years old" };
    sex = await helper.execValdnAndTrim(sex, "Sex");
    await helper.isSexValid(sex);
    let newChild = {
        name: name,
        age: age,
        sex: sex,
        jobId: "",
        mealRequirements: [],
        vaccine: [],
        nannyId: "",
        appointments: [],
    };
    if (mealRequirementsArr) {
        await helper.execValdnForArr(mealRequirementsArr, "Meal Requirements");
        newChild.mealRequirements = mealRequirementsArr;
    }
    if (vaccineArr) {
        await helper.execValdnForArr(vaccineArr, "Vaccines");
        newChild.vaccine = vaccineArr;
    }
    if (appointmentsArr) {
        await helper.execValdnForArr(appointmentsArr, "Appointments");
        newChild.appointments = appointmentsArr;
    }
    if (photoUrl) {
        photoUrl = await helper.execValdnAndTrim(photoUrl, "PhotoUrl");
        await helper.validateImageUrl(photoUrl);
        newChild.photoUrl = photoUrl;
    }
    const childCollection = await childs();
    const insertedChild = await childCollection.insertOne(newChild);
    if (!insertedChild.acknowledged || !insertedChild.insertedId) throw { statusCode: 500, message: "Could not create child" };
    const child = await getChildById(insertedChild.insertedId.toString());
    return child;
};

const getChildById = async (childId) => {
    childId = await helper.execValdnAndTrim(childId, "Child Id");
    if (!ObjectId.isValid(childId)) throw { statusCode: 400, message: "Invalid object ID" };
    const childCollection = await childs();
    const childFound = await childCollection.findOne({ _id: ObjectId(childId) });
    if (childFound === null) throw { statusCode: 404, message: "No child with that Id" };
    childFound._id = childFound._id.toString();
    return childFound;
};

const updateChild = async (childId, name, age, sex, jobId, mealRequirements, vaccine, nannyId, appointments) => {
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
    const updatedChild = await childCollection.replaceOne({ _id: ObjectId(childId) }, editedChild);
    if (!updatedChild.acknowledged || updatedChild.modifiedCount == 0) throw { statusCode: 500, message: "couldn't update child!" };
    const child = await getChildById(childId);
    return child;
};

const removeChild = async (childId) => {
    if (typeof childId == "undefined") throw { statusCode: 400, message: "childId must be provided" };
    if (typeof childId !== "string") throw { statusCode: 400, message: "childId must be a string" };
    if (childId.trim().length === 0) throw { statusCode: 400, message: "id cannot be an empty string or just spaces" };
    childId = childId.trim();
    if (!ObjectId.isValid(childId)) throw { statusCode: 400, message: "invalid object ID" };
    const childCollection = await childs();
    let currentChild = await getChildById(childId)

    const deletedChild = await childCollection.findOneAndDelete({
        _id: ObjectId(childId)}, { projection: { _id: 1 }});
    if (deletedChild.value == null) {
        throw { statusCode: 401, message: `Could not delete child with id of ${childId}` };
    }
    return deletedChild.value._id;
};

const removeChildFromUser = async (parentId,childId) => {
    parentId = await helper.execValdnAndTrim(parentId, "Child Id");
    if (!ObjectId.isValid(parentId)) {
        throw { statusCode: 400, message: "Child Id is not valid" };
    }

    // const childInDb = await getChildById(childId)
    // if (childInDb != null)
    // throw {
    //   statusCode: 400,
    //   message:
    //     "child Cannot be deleted. Please delete the child from the child collection first to delete this job",
    // };
    const userCollection = await users();
    // let getUser = userCollection.findOne({ _id: ObjectId(parentId) })
    const removeChildId = await userCollection.updateOne({ _id: ObjectId(parentId), p_childIds: { $elemMatch: { $eq: childId } } },
    { $pull: { p_childIds: childId } } );
    if (!removeChildId.acknowledged || removeChildId.modifiedCount == 0)
    throw {
      statusCode: 400,
      message: "Couldn't update child from user collection",
    };
    return  removeChildId;
}


const addVaccine = async (name, date, doses, childId) => {
    childId = await helper.execValdnAndTrim(childId, "Child Id");
    if (!ObjectId.isValid(childId)) {
        throw { statusCode: 400, message: "Child Id is not valid" };
    }
    name = await helper.execValdnAndTrim(name, "name");
    await helper.onlyLettersNumbersAndSpaces(name, "name");

    date = await helper.execValdnAndTrim(date, "date");
    await helper.isDateValid(date, "Date");
    doses = await helper.execValdnAndTrim(doses, "Doses");
    await helper.onlyNumbers(doses, "doses");

    let vaccineId = new ObjectId();

    let newVaccine = {
        _id: vaccineId,
        name: name,
        date: date,
        doses: doses,
    };

    const childCollection = await childs();
    const vaccineList = await childCollection.updateOne({ _id: ObjectId(childId) }, { $push: { vaccine: newVaccine } });
    if (!vaccineList.acknowledged || vaccineList.modifiedCount !== 1) throw { statusCode: 500, message: "Could not add vaccine" };

    const updatedChild = await getChildById(childId);
    return updatedChild.vaccine;
};

const getVaccines = async (childId) => {
    childId = await helper.execValdnAndTrim(childId, "Child Id");
    if (!ObjectId.isValid(childId)) {
        throw { statusCode: 401, message: "Child Id is not valid" };
    }
    const childCollection = await childs();
    const childFound = await childCollection.findOne({ _id: ObjectId(childId) });
    if (childFound === null) throw { statusCode: 400, message: "No child with that Id" };
    const childvaccines = childFound.vaccine;
    return childvaccines;
};

const getAppointments = async (childId) => {
    childId = await helper.execValdnAndTrim(childId, "Child Id");
    if (!ObjectId.isValid(childId)) {
        throw { statusCode: 400, message: "Child Id is not valid" };
    }

    const childCollection = await childs();
    const childFound = await childCollection.findOne({ _id: ObjectId(childId) });
    if (childFound === null) throw { statusCode: 400, message: "No child with that Id" };
    const childAppointments = childFound.appointments;
    return childAppointments;
};

const addAppointment = async (doctor, hospital, date, time, childId) => {
    childId = await helper.execValdnAndTrim(childId, "Child Id");
    if (!ObjectId.isValid(childId)) {
        throw { statusCode: 400, message: "Child Id is not valid" };
    }
    doctor = await helper.execValdnAndTrim(doctor, "doctor");
    await helper.isNameValid(doctor, "doctor");

    hospital = await helper.execValdnAndTrim(hospital, "hospital");
    await helper.onlyLettersNumbersAndSpaces(hospital, "hospital");

    date = await helper.execValdnAndTrim(date, "date");
    await helper.isDateValid(date, "Date");

    let appointmentId = new ObjectId();
    let newAppointment = {
        _id: appointmentId,
        doctor: doctor,
        hospital: hospital,
        date: date,
        time: time,
    };
    const childCollection = await childs();
    const appointmentList = await childCollection.updateOne({ _id: ObjectId(childId) }, { $push: { appointments: newAppointment } });
    if (!appointmentList.acknowledged || appointmentList.modifiedCount !== 1) throw { statusCode: 500, message: "Could not add appointment" };

    const updatedChild = await getChildById(childId);
    return updatedChild.appointments;
};
const removeVaccine = async (vaccineId) => {
    vaccineId = await helper.execValdnAndTrim(vaccineId, "vaccine Id");
    if (!ObjectId.isValid(vaccineId)) {
        throw { statusCode: 400, message: "Vaccine Id is not valid" };
    }

    const childCollection = await childs();
    const vaccine = await childCollection.findOne(
        { vaccine: { $elemMatch: { _id: ObjectId(vaccineId) } } },
        {
            projection: {
                _id: 1,
                vaccine: { $elemMatch: { _id: ObjectId(vaccineId) } },
            },
        }
    );

    if (vaccine !== null) {
        const postVaccine = vaccine._id;
        const remVaccine = await childCollection.updateOne({ _id: postVaccine }, { $pull: { vaccine: { _id: ObjectId(vaccineId) } } });
        return remVaccine;
    } else {
        throw { statusCode: 400, message: "Vaccine does not exist" };
    }
};

const removeAppointment = async (appointmentId) => {
    appointmentId = await helper.execValdnAndTrim(appointmentId, "appointment Id");
    if (!ObjectId.isValid(appointmentId)) {
        throw { statusCode: 400, message: "Appointment Id is not valid" };
    }

    const childCollection = await childs();
    const appointment = await childCollection.findOne(
        { appointments: { $elemMatch: { _id: ObjectId(appointmentId) } } },
        {
            projection: {
                _id: 1,
                appointments: { $elemMatch: { _id: ObjectId(appointmentId) } },
            },
        }
    );

    if (appointment !== null) {
        const postAppointment = appointment._id;
        const remAppointment = await childCollection.updateOne(
            { _id: postAppointment },
            { $pull: { appointments: { _id: ObjectId(appointmentId) } } }
        );
        return remAppointment;
    } else {
        throw { statusCode: 400, message: "Appointment does not exist" };
    }
};

const getMealPlans = async (childId) => {
    await helper.isIdValid(childId, "childId");
    await helper.execValdnAndTrim(childId, "childId");
    const childCollection = await childs();
    const childFound = await childCollection.findOne({ _id: ObjectId(childId) });
    if (childFound === null) throw { statusCode: 400, message: "No child with that Id" };
    const mealDetails = childFound.mealRequirements;
    return mealDetails;
};

const addAMealPlan = async (meal, time, directions, childId) => {
    childId = await helper.execValdnAndTrim(childId, "Child Id");
    if (!ObjectId.isValid(childId)) {
        throw { statusCode: 400, message: "Child Id is not valid" };
    }
    meal = await helper.execValdnAndTrim(meal, "meal");
    await helper.onlyLettersNumbersAndSpaces(meal, "meal");

    let mealId = new ObjectId();
    let newMeal = {
        _id: mealId,
        meal: meal,
        time: time,
        directions: directions,
    };
    const childCollection = await childs();
    const mealList = await childCollection.updateOne({ _id: ObjectId(childId) }, { $push: { mealRequirements: newMeal } });
    if (!mealList.acknowledged || mealList.modifiedCount !== 1) throw { statusCode: 500, message: "Could not add Meal" };

    const updatedChild = await getChildById(childId);
    return updatedChild.mealRequirements;
};

const removeMeal = async (mealId) => {
    mealId = await helper.execValdnAndTrim(mealId, "Meal Id");
    if (!ObjectId.isValid(mealId)) {
        throw { statusCode: 400, message: "Meal Id is not valid" };
    }

    const childCollection = await childs();
    const meal = await childCollection.findOne(
        { mealRequirements: { $elemMatch: { _id: ObjectId(mealId) } } },
        {
            projection: {
                _id: 1,
                mealRequirements: { $elemMatch: { _id: ObjectId(mealId) } },
            },
        }
    );

    if (meal !== null) {
        const postMeal = meal._id;
        const remMeal = await childCollection.updateOne({ _id: postMeal }, { $pull: { mealRequirements: { _id: ObjectId(mealId) } } });
        return remMeal;
    } else {
        throw { statusCode: 400, message: "Meal does not exist" };
    }
};

const getChildrenByIds = async (arrIds) => {
    await helper.execValdnForArr(arrIds, "Ids");
    const badInput = (str) => str === undefined || str === null || str === "" || !ObjectId.isValid(str);
    if (arrIds.some(badInput)) {
        throw { statusCode: 400, message: `Invalid id` };
    }
    const objectIdArr = arrIds.map((id) => new ObjectId(id));
    const childCollection = await childs();
    let childObjArr = await childCollection.find({ _id: { $in: objectIdArr } }).toArray();
    if (childObjArr.length > 0) {
        childObjArr = childObjArr.map((childObj) => {
            return {
                ...childObj,
                _id: childObj._id.toString(),
            };
        });
    }
    return childObjArr;
};

module.exports = {
    createChild,
    getChildById,
    updateChild,
    removeChild,
    removeChildFromUser,
    addVaccine,
    getVaccines,
    getAppointments,
    addAppointment,
    removeVaccine,
    removeAppointment,
    getMealPlans,
    addAMealPlan,
    removeMeal,
    getChildrenByIds,
};
