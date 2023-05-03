const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const helper = require("../helpers");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,
})
console.log(process.env.BUCKET + " Bucket here")
const BUCKET = process.env.BUCKET;
const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        bucket: BUCKET,
        s3: s3,
        acl: "public-read",
        key: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
})

router
    .route("/signup").post(async (req, res) => {
        let { firstName, lastName, email, profile, age, uuid } = req.body;
        try {
            firstName = await helper.execValdnAndTrim(firstName, "FirstName");
            await helper.isNameValid(firstName, "FirstName");
            lastName = await helper.execValdnAndTrim(lastName, "LastName");
            await helper.isNameValid(lastName, "LastName");
            email = await helper.execValdnAndTrim(email, "Email");
            await helper.isEmailValid(email, "Email");
            profile = await helper.execValdnAndTrim(profile, "Profile");
            await helper.isProfileValid(profile, "Profile");
            age = await helper.execValdnAndTrim(age, "Age");
            await helper.isAgeValid(parseInt(age), "Age");
            uuid = await helper.execValdnAndTrim(uuid, "Uuid");
        } catch (e) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        }
        try {
            const userCreated = await userData.createUser(firstName, lastName, email, profile, age, uuid);
            if (!userCreated) {
                throw { statusCode: 500, message: `Couldn't Create user` };
            }
            return res.json(userCreated);
        } catch (e) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        }
    });

router
    .route("/signin/:uuId").post(async (req, res) => {
        let uuId = req.params.uuId;
        try {
            uuId = await helper.execValdnAndTrim(uuId, "Uuid");
        } catch (e) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        }
        try {
            const userFetched = await userData.getUserByFirebaseId(uuId);
            if (!userFetched) {
                throw { statusCode: 500, message: `Couldn't fetch user` };
            }
            return res.json(userFetched);
        } catch (e) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        }
    });
router
    .route("/:userId")
    .get(async (req, res) => {
        let userId = req.params.userId;
        try {
            userId = await helper.execValdnAndTrim(userId, "userId");
            if (!ObjectId.isValid(userId)) {
                throw { statusCode: 400, message: "userId is not valid" };
            }
            const userObj = await userData.getUserById(userId);
            if (!userObj || userObj === null || userObj === undefined) throw { statusCode: 404, message: `No user exists with that id` };
            return res.json(userObj);
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    })
    .put(async (req, res) => {
        let { username, password, email, type, age, photo, lctn } = req.body;
        try {
            const updatedUser = await userData.updateUser(req.params.userId, username, password, email, type, age, photo, lctn);
            if (!updatedUser) {
                throw "Couldn't update user";
            }
            res.json(updatedUser);
        } catch (e) {
            return res.status(400).json({ error: e });
        }
    })
    .patch(async (req, res) => {
        try {
            let { firstName, lastName, age, email, address, photoUrl, profile, n_yearsOfExperience, n_qualifications, n_certifications, n_skills } =
                req.body;
            let userId = req.params.userId;
            userId = await helper.execValdnAndTrim(userId, "User Id");
            if (!ObjectId.isValid(userId)) throw { statusCode: 400, message: "Invalid object ID" };
            let cur_userObj = await userData.getUserById(userId);
            let userObj = {};
            if (firstName) {
                firstName = await helper.execValdnAndTrim(firstName, "First Name");
                await helper.isNameValid(firstName, "First Name");
                if (cur_userObj.firstName != firstName) userObj.firstName = firstName;
            }

            if (lastName) {
                lastName = await helper.execValdnAndTrim(lastName, "Last Name");
                await helper.isNameValid(lastName, "Last Name");
                if (cur_userObj.lastName != lastName) userObj.lastName = lastName;
            }

            if (age) {
                age = await helper.execValdnAndTrim(age, "Age");
                await helper.isAgeValid(age, "Age");
                if (cur_userObj.age != age) userObj.age = age;
            }

            if (email) {
                email = await helper.execValdnAndTrim(email, "Email");
                await helper.isEmailValid(email, "Email");
                if (cur_userObj.email != email) userObj.email = email;
            }

            if (address) {
                address = await helper.execValdnAndTrim(address, "Address");
                if (cur_userObj.address != address) userObj.address = address;
            }

            if (photoUrl) {
                photoUrl = await helper.execValdnAndTrim(photoUrl, "PhotoUrl");
                if (cur_userObj.photoUrl != photoUrl) userObj.photoUrl = photoUrl;
            }

            if (profile) {
                profile = await helper.execValdnAndTrim(profile, "Profile");
                await helper.isProfileValid(profile, "Profile");
                if (cur_userObj.profile != profile) userObj.profile = profile;
            }

            if (n_yearsOfExperience) {
                n_yearsOfExperience = await helper.execValdnAndTrim(n_yearsOfExperience, "Years Of Experience");
                if (cur_userObj.n_yearsOfExperience != n_yearsOfExperience) userObj.n_yearsOfExperience = n_yearsOfExperience;
            }

            if (n_qualifications) {
                n_qualifications = await helper.execValdnAndTrim(n_qualifications, "Educational Qualifications");
                if (cur_userObj.n_qualifications != n_qualifications) userObj.n_qualifications = n_qualifications;
            }

            if (n_certifications) {
                n_certifications = await helper.execValdnAndTrim(n_certifications, "Certifications");
                if (cur_userObj.n_certifications != n_certifications) userObj.n_certifications = n_certifications;
            }

            if (n_skills) {
                n_skills = await helper.execValdnAndTrim(n_skills, "Skills");
                if (cur_userObj.n_skills != n_skills) userObj.n_skills = n_skills;
            }

            if (Object.keys(userObj).length == 0) {
                throw { statusCode: 400, message: "No fields were changed" };
            }

            const updatedUserObj = await userData.updateUser(userId, userObj);
            if (!updatedUserObj || updatedUserObj === null || updatedUserObj === undefined)
                throw { statusCode: 500, message: `Internal error occured` };
            return res.json(updatedUserObj);
        } catch (e) {
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const userDeleted = await userData.removeUser(req.params.userId);
            res.json({ Awesome: `user with id: ${req.params.userId} deleted successfully` });
        } catch (e) {
            return res.status(404).json({ error: e });
        }
    });

router
    .route("/upload")
    .post(upload.single("file"), async (req, res) => {
        console.log(req.file)
        return res.status(200).json("successfully uploaded ");
    })

// router
//     .route("/list")
//     .get(async (req, res) => {
//         let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise()
//         let x = await r.Contents.map(item => item.Key);
//         return res.send(x)
//     })

router
    .route("/download/:filename")
    .get(async (req, res) => {
        const filename = req.params.filename
        let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
        return res.send(x.Body);
    })

router
    .route("/delete/:filename")
    .delete(async (req, res) => {
        const filename = req.params.filename
        await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
        return res.status(200).json("File Deleted!")
    })





module.exports = router;
