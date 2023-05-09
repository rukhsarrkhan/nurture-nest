const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const helper = require("../helpers");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const gm = require("gm").subClass({ imageMagick: true });
const mime = require("mime");
const { getChildrenByIds } = require("../data/child");
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

router.route("/signup").post(async (req, res) => {
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
        const userCreated = await userData.createUser(xss(firstName), xss(lastName), xss(email), xss(profile), xss(age), xss(uuid));
        if (!userCreated) {
            throw { statusCode: 500, message: `Couldn't Create user` };
        }
        return res.json(userCreated);
    } catch (e) {
        return res.status(e.statusCode).json({ title: "Error", message: e.message });
    }
});

router.route("/signin/:uuId").post(async (req, res) => {

    let uuId = req.params.uuId;
    let { email, firstName, lastName } = req.body;
    try {
        uuId = await helper.execValdnAndTrim(uuId, "Uuid");
        if (firstName !== undefined) {
            firstName = await helper.execValdnAndTrim(firstName, "FirstName");
            await helper.isNameValid(firstName, "FirstName");
        }
        if (lastName !== undefined) {
            lastName = await helper.execValdnAndTrim(lastName, "LastName");
            await helper.isNameValid(lastName, "LastName");
        }
        if (email !== undefined) {
            email = await helper.execValdnAndTrim(email, "Email");
            await helper.isEmailValid(email, "Email");
        }

    } catch (e) {
        return res.status(e.statusCode).json({ title: "Error", message: e.message });
    }
    try {
        const userFetched = await userData.getUserByFirebaseId(uuId, firstName, lastName, email);
        if (!userFetched) {
            throw { statusCode: 500, message: `Couldn't fetch user` };
        }
        return res.json(userFetched);
    } catch (e) {
        return res.status(e.statusCode).json({ title: "Error", message: e.message });
    }
});
router.route("/image/:userId").put(parseForm.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            throw { statusCode: 400, message: `No file uploaded` };
        }
        let userId = req.params.userId;
        userId = await helper.execValdnAndTrim(userId, "User Id");
        if (!ObjectId.isValid(userId)) throw { statusCode: 400, message: "Invalid object ID" };
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
                        // const uploadImg = upload.single("image");
                        req.file.buffer = buffer;
                        const params = {
                            Bucket: BUCKET,
                            Key: `image-${Date.now()}.jpeg`, // add a timestamp to the filename to ensure it's unique
                            Body: buffer,
                            ContentType: req.file.mimetype,
                        };
                        const data = await s3.upload(params).promise();
                        const updatedUserObj = await userData.updateUser(userId, { photoUrl: data.Location });
                        if (!updatedUserObj || updatedUserObj === null || updatedUserObj === undefined)
                            return res.status(500).json({ title: "Error", message: `An unexpected error occurred.` });
                        return res.json(updatedUserObj);
                    } catch (error) {
                        return res.status(500).json({ title: "Error", message: "An unexpected error occurred" });
                    }
                }
            });
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
            return res.status(e.statusCode).json({ title: "Error", message: e.message });
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
            let {
                firstName,
                lastName,
                age,
                email,
                address,
                photoUrl,
                profile,
                phone,
                sex,
                n_yearsOfExperience,
                n_qualifications,
                n_certifications,
                n_skills,
            } = req.body;
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
            if (sex) {
                sex = await helper.execValdnAndTrim(sex, "Sex");
                await helper.isSexValid(sex);
                if (cur_userObj.sex != sex) userObj.sex = sex;
            }
            if (phone) {
                phone = await helper.execValdnAndTrim(phone, "phone");
                await helper.validatePhoneNumber(phone, "Phone number");
                if (cur_userObj.phone != phone) userObj.phone = phone;
            }

            if (address) {
                address = await helper.execValdnAndTrim(address, "Address");
                if (cur_userObj.address != address) userObj.address = address;
            }

            if (photoUrl) {
                photoUrl = await helper.execValdnAndTrim(photoUrl, "PhotoUrl");
                await helper.validateImageUrl(photoUrl);
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

router.route("/delete/:filename").delete(async (req, res) => {
    const filename = req.params.filename;
    await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
    return res.status(200).json("File Deleted!");
});

router.route("/children/:userId").get(async (req, res) => {
    try {
        let userId = req.params.userId;
        userId = await helper.execValdnAndTrim(userId, "userId");
        if (!ObjectId.isValid(userId)) {
            throw { statusCode: 400, message: "userId is not valid" };
        }
        const userObj = await userData.getUserById(userId);
        if (!userObj || userObj === null || userObj === undefined) throw { statusCode: 404, message: `No user exists with that id` };
        let childrenIdArr = [];
        if (userObj.profile === global.userTypeNanny) {
            childrenIdArr = userObj.n_childIds;
        } else if (userObj.profile === global.userTypeParent) {
            childrenIdArr = userObj.p_childIds;
        }
        if (childrenIdArr.length === 0) {
            return res.json([]);
        }
        const childrenObjArr = await getChildrenByIds(childrenIdArr);
        //no need to handle. If empty then return empty array
        return res.json(childrenObjArr);
    } catch (e) {
        return res.status(404).json({ error: e });
    }
});

module.exports = router;
