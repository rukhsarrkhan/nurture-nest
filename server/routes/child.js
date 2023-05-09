const express = require("express");
const router = express.Router();
const data = require("../data");
const childCollection = data.child;
const jobCollection = data.job;
const userData = data.users;
const helper = require("../helpers");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const gm = require("gm").subClass({ imageMagick: true });
const mime = require("mime");
const xss = require("xss");
aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
});
const BUCKET = process.env.BUCKET;
const s3 = new aws.S3();
const parseForm = multer();
const upload = multer({
  storage: multerS3({
    bucket: BUCKET,
    s3: s3,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, `image-${Date.now()}.jpeg`);
    },
  }),
});

router.route("/").post(parseForm.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      throw { statusCode: 400, message: `No file uploaded` };
    }
    let photoUrl = "";
    let {
      name,
      age,
      sex,
      mealRequirementsArr,
      vaccineArr,
      appointmentsArr,
      parentId,
    } = req.body;
    name = await helper.execValdnAndTrim(name, "Name");
    await helper.isNameValid(name, "Name");
    age = await helper.execValdnAndTrim(age, "Age");
    if (isNaN(age)) {
      throw { statusCode: 400, message: `${fieldName} should be a number` };
    }
    if (parseInt(age) > 12)
      throw {
        statusCode: 400,
        message: "child cannnot be more than 12 years old",
      };
    sex = await helper.execValdnAndTrim(sex, "Sex");
    await helper.isSexValid(sex);
    if (mealRequirementsArr) {
      await helper.execValdnForArr(mealRequirementsArr, "Meal Requirements");
    }
    if (vaccineArr) {
      await helper.execValdnForArr(vaccineArr, "Vaccines");
    }
    if (appointmentsArr) {
      await helper.execValdnForArr(appointmentsArr, "Appointments");
    }
    let parentObj = await userData.getUserById(parentId);
    if (!parentObj)
      throw { statusCode: 404, message: "No parent with that id" };
    if (parseInt(parentObj.age) - parseInt(age) < 16) {
      throw {
        statusCode: 400,
        message: "Invalid age difference between parent and child",
      };
    }
    if (parentObj.profile !== global.userTypeParent) {
      throw {
        statusCode: 400,
        message: "ParentId doesn't belong to a parent.",
      };
    }
    const fileType = mime.getExtension(req.file.mimetype);
    if (fileType !== "jpeg" && fileType !== "png" && fileType !== "gif") {
      throw { statusCode: 400, message: `Invalid file type` };
    }
    gm(req.file.buffer)
      .autoOrient() // fix image orientation if necessary
      .resize(200, 200, "^") // resize the image to fit within 200x200 without distorting the aspect ratio
      .gravity("Center") // center the crop on the resized image
      .crop(200, 200) // crop the resized image to a 200x200 square
      .toBuffer(async (err, buffer) => {
        if (err) {
          return res.status(500).json({ title: "Error", message: err.message });
        } else {
          try {
            req.file.buffer = buffer;
            const params = {
              Bucket: BUCKET,
              Key: `image-${Date.now()}.jpeg`, // add a timestamp to the filename to ensure it's unique
              Body: buffer,
              ContentType: req.file.mimetype,
            };
            const data = await s3.upload(params).promise();
            photoUrl = data.Location;
            const childCreated = await childCollection.createChild(
              xss(photoUrl),
              xss(name),
              xss(age),
              xss(sex),
              xss(mealRequirementsArr),
              xss(vaccineArr),
              xss(appointmentsArr)
            );
            if (!childCreated) {
              throw { statusCode: 500, message: "Internal Server error" };
            }
            childCreated._id = childCreated._id.toString();
            let userUpdated = await userData.addChildToUser(
              xss(parentId),
              xss(childCreated._id.toString())
            );
            if (userUpdated) {
              // parentObj = await userData.getUserById(parentId);
            }
            return res.json(childCreated);
          } catch (error) {
            return res
              .status(500)
              .json({
                title: "Error",
                message: "An unexpected error occurred",
              });
          }
        }
      });
  } catch (e) {
    return res.status(e.statusCode).json({ message: e.message });
  }
});
router
  .route("/:childId")
  .get(async (req, res) => {
    try {
      let childId = req.params.childId;
      childId = await helper.execValdnAndTrim(childId, "Child Id");
      const childObj = await childCollection.getChildById(req.params.childId);
      if (!childObj || childObj === null || childObj === undefined) {
        throw { statusCode: 404, message: "No child found with that id" };
      }
      return res.json(childObj);
    } catch (e) {
      return res.status(e.statusCode).json({ message: e.message });
    }
  })
  .put(async (req, res) => {
    try {
      let {
        name,
        age,
        sex,
        jobId,
        mealRequirements,
        vaccine,
        nannyId,
        appointments,
      } = req.body;
      const updatedChild = await childCollection.updateChild(
        req.params.childId,
        name,
        age,
        sex,
        jobId,
        mealRequirements,
        vaccine,
        nannyId,
        appointments
      );
      if (!updatedChild) {
        throw "Couldn't update child";
      }
      res.json(updatedChild);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    try {
      const childDeleted = await childCollection.removeChild(
        req.params.childId
      );
      res.json({
        Awesome: `child with id: ${req.params.childId} deleted successfully`,
      });
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  });

router
  .route("/vaccine/:childId")
  .get(async (req, res) => {
    childId = req.params.childId;
    try {
      await helper.validateInput(childId, "child Id");
      await helper.onlyLettersNumbersAndSpaces(childId, "child Id");
      if (!ObjectId.isValid(childId)) {
        throw { statusCode: 400, message: "Child Id is not valid" };
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const vaccineFound = await childCollection.getVaccines(childId);
      if (!vaccineFound) {
        throw "Child not found";
      }
      return res.json(vaccineFound);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  })
  .post(async (req, res) => {
    childId = req.params.childId;
    const postVaccine = req.body;
    try {
      childId = await helper.execValdnAndTrim(childId, "Child Id");
      if (!ObjectId.isValid(childId)) {
        throw { statusCode: 400, message: "Child Id is not valid" };
      }
      await helper.execValdnAndTrim(postVaccine.name, "name");
      await helper.onlyLettersNumbersAndSpaces(postVaccine.name, "name");
      await helper.execValdnAndTrim(postVaccine.date, "date");
      await helper.isDateValid(postVaccine.date, "Date");
      await helper.execValdnAndTrim(postVaccine.doses, "Doses");
      await helper.onlyNumbers(postVaccine.doses, "doses");
    } catch (e) {
      return res
        .status(e.statusCode)
        .json({ title: "Error", message: e.message });
    }

    try {
      const { name, date, doses } = postVaccine;
      const vaccineAdded = await childCollection.addVaccine(
        xss(name),
        xss(date),
        xss(doses),
        xss(childId)
      );
      if (!vaccineAdded) {
        throw "Couldn't creatva";
      }
      return res.json(vaccineAdded);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  });

router
  .route("/appointment/:childId")
  .get(async (req, res) => {
    childId = req.params.childId;
    try {
      childId = await helper.execValdnAndTrim(childId, "Child Id");
      if (!ObjectId.isValid(childId)) {
        throw { statusCode: 400, message: "Child Id is not valid" };
      }
    } catch (e) {
      return res
        .status(e.statusCode)
        .json({ title: "Error", message: e.message });
    }

    try {
      const appointmentFound = await childCollection.getAppointments(childId);
      if (!appointmentFound) {
        throw "appointment not found";
      }
      return res.json(appointmentFound);
    } catch (e) {
      return res
        .status(e.statusCode)
        .json({ title: "Error", message: e.message });
    }
  })
  .post(async (req, res) => {
    childId = req.params.childId;
    const postAppointment = req.body;
    try {
      childId = await helper.execValdnAndTrim(childId, "Child Id");
      if (!ObjectId.isValid(childId)) {
        throw { statusCode: 400, message: "Child Id is not valid" };
      }
      postAppointment.doctor = await helper.execValdnAndTrim(
        postAppointment.doctor,
        "doctor"
      );
      await helper.isNameValid(postAppointment.doctor, "doctor");

      postAppointment.hospital = await helper.execValdnAndTrim(
        postAppointment.hospital,
        "hospital"
      );
      await helper.onlyLettersNumbersAndSpaces(
        postAppointment.hospital,
        "hospital"
      );

      postAppointment.date = await helper.execValdnAndTrim(
        postAppointment.date,
        "date"
      );
      await helper.isDateValid(postAppointment.date, "Date");
    } catch (e) {
      return res
        .status(e.statusCode)
        .json({ title: "Error", message: e.message });
    }

    try {
      const { doctor, hospital, date, time } = postAppointment;
      const appointmentAdded = await childCollection.addAppointment(
        xss(doctor),
        xss(hospital),
        xss(date),
        xss(time),
        xss(childId)
      );
      if (!appointmentAdded) {
        throw "Couldn't create";
      }
      return res.json(appointmentAdded);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  });

router.route("/vaccine/:vaccineId").delete(async (req, res) => {
  const vaccId = req.params.vaccineId;
  try {
    await helper.execValdnAndTrim(vaccId, "Vaccine Id");
    if (!ObjectId.isValid(vaccId)) {
      throw { statusCode: 400, message: "Vaccine Id is not valid" };
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    const removedVaccine = await childCollection.removeVaccine(vaccId);
    return res.status(200).json(removedVaccine);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
  //code here for DELETE
});

router.route("/appointment/:appointmentId").delete(async (req, res) => {
  const appointmentId = req.params.appointmentId;
  try {
    await helper.execValdnAndTrim(appointmentId, "Vaccine Id");
    if (!ObjectId.isValid(appointmentId)) {
      throw { statusCode: 400, message: "Appointment Id is not valid" };
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const removedAppointment = await childCollection.removeAppointment(
      appointmentId
    );
    return res.status(200).json(removedAppointment);
  } catch (e) {
    return res
      .status(e.statusCode)
      .json({ title: "Error", message: e.message });
  }
});

router
  .route("/mealplan/:childId")
  .get(async (req, res) => {
    childId = req.params.childId;
    try {
      await helper.validateInput(childId, "child Id");
      await helper.onlyLettersNumbersAndSpaces(childId, "child Id");
      await helper.isIdValid(childId);
      const mealsFound = await childCollection.getMealPlans(childId);
      if (!mealsFound) {
        throw "Meals not found";
      }
      return res.json(mealsFound);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  })
  .post(async (req, res) => {
    childId = req.params.childId;
    const postMeal = req.body;
    try {
      childId = await helper.execValdnAndTrim(childId, "Child Id");
      if (!ObjectId.isValid(childId)) {
        throw { statusCode: 400, message: "Child Id is not valid" };
      }
      postMeal.meal = await helper.execValdnAndTrim(postMeal.meal, "meal");
      await helper.onlyLettersNumbersAndSpaces(postMeal.meal, "meal");
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const { meal, time, directions } = postMeal;
      const mealAdded = await childCollection.addAMealPlan(
        xss(meal),
        xss(time),
        xss(directions),
        xss(childId)
      );
      if (!mealAdded) {
        throw "Couldn't create";
      }
      return res.json(mealAdded);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  });

router.route("/mealplan/:mealId").delete(async (req, res) => {
  const mealId = req.params.mealId;
  try {
    await helper.execValdnAndTrim(mealId, "Meal Id");
    if (!ObjectId.isValid(mealId)) {
      throw { statusCode: 400, message: "Meal Id is not valid" };
    }
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const removedMeal = await childCollection.removeMeal(mealId);
    return res.status(200).json(removedMeal);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});
router.route("/removeChild/:childId").delete(async (req, res) => {
  const childId = req.params.childId;
  const parentId = req.body._id;

  try {
    await helper.execValdnAndTrim(childId, "Child Id");
    if (!ObjectId.isValid(childId)) {
      throw { statusCode: 400, message: "Child Id is not valid" };
    }
    await helper.execValdnAndTrim(parentId, "Parent Id");
    if (!ObjectId.isValid(parentId)) {
      throw { statusCode: 400, message: "Parent Id is not valid" };
    }
  } catch (e) {
    return res
      .status(e.statusCode)
      .json({ title: "Error", message: e.message });
  }
  try {
    let childObj = await childCollection.getChildById(childId);
    if (childObj === null || childObj === undefined) {
      throw { statusCode: 404, message: "No child found for that id" };
    }
    let jobObj = await jobCollection.getJobByChildId(childId);
    if (jobObj && Object.keys(jobObj).length !== 0) {
        if (jobObj?.nannyId !== "" && jobObj?.nannyId !== undefined && jobObj?.nannyId !== null) {
          throw {
            statusCode: 400,
            message:
              "This child has a Nanny assigned. Fire the nanny first to remove this child from the system",
          };
        }

    }

    let imageKey = childObj?.photoUrl?.substring(
      childObj?.photoUrl?.lastIndexOf("/") + 1
    );
    if (imageKey) {
      const params = {
        Bucket: BUCKET,
        Key: imageKey,
      };
      await s3.deleteObject(params).promise();
    }
    const removeChildFrmUserCllcn = await childCollection.removeChildFromUser(
      parentId,
      childId.toString()
    );
    const removeChildIdFrmChild = await childCollection.removeChild(childId);
    if (jobObj !== null) {
      const removeJobforChild = await jobCollection.removeJob(
        jobObj._id.toString()
      );
    }
    if (
      !removeChildFrmUserCllcn.acknowledged ||
      removeChildFrmUserCllcn.modifiedCount == 0
    )
      throw {
        statusCode: 400,
        message: "Couldn't update child from user collection",
      };

    if (removeChildIdFrmChild._id === null) {
      throw {
        statusCode: 401,
        message: `Could not delete child with id of ${childId}`,
      };
    }
    return res.status(200).json(removeChildIdFrmChild);
  } catch (e) {
    if (
      e.statusCode !== "" &&
      e.statusCode !== undefined &&
      e.statusCode !== null
    ) {
      return res
        .status(e.statusCode)
        .json({ title: "Error", message: e.message });
    } else {
      return res
        .status(500)
        .json({ title: "Error", message: "Some Error Occured" });
    }
  }
});

module.exports = router;
