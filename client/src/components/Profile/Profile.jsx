import React, { useState, useEffect } from "react";

import "../../App.css";
import { useParams } from "react-router-dom";
import { Typography, Avatar, Grid, Paper, Button, TextField, FormLabel, RadioGroup, FormControlLabel, Radio, Box, Alert } from "@mui/material";
import helpers from "../../helpers";
import { connect } from "react-redux";
import { setUserProfileAPICall, updateProfileImageAPICall, updateUserAPICall } from "../../redux/users/userActions";
import Loading from "../Loading";
// import axios from "axios";

const Profile = ({ userData, setUserProfileAPICall, updateUserAPICall, updateProfileImageAPICall }) => {
    const [userObjData, setuserObjData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("");
    const [address, setAddress] = useState("");
    const [dob, setDOB] = useState("");
    const [phone, setPhone] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState(null);

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [ageError, setAgeError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [dobError, setDOBError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [sexError, setSexError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const validSexArr = ["male", "female", "non-binary", "transgender", "other"];

    let { userId } = useParams();
    const formatDate = (showdate) => {
        if (showdate) {
            var year = showdate.substring(0, 4);
            var month = showdate.substring(5, 7);
            var day = showdate.substring(8, 10);
            return month + "/" + day + "/" + year;
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 1000000) {
                setImageError("File size should not exceed 1 MB.");
                setImagePreview(null);
            } else {
                setImagePreview(URL.createObjectURL(file));
                setImageFile(file);
                setImage(null);
                setImageError(null);
            }
        } else {
            setImagePreview(null);
            setImageError(null);
        }
    };

    const handleImageSubmit = async () => {
        console.log("Here in image submit");
        try {
            if (!imageFile) {
                setImageError("No image available");
                setImagePreview(null);
                return;
            }
            const formData = new FormData();
            formData.append("image", imageFile);

            await updateProfileImageAPICall(userId, formData);
            // const response = await axios.put("http://localhost:3000/users/image", formData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSexChange = (event) => {
        setSex(event.target.value);
    };

    const validation = async (field, valFunc) => {
        //need to change valdn function.. it'll fail if str is empty spaces.
        let fieldVal = await helpers.execValdnAndTrim(field);
        let check = "";
        if (valFunc) {
            check = await valFunc;
        }
        if (fieldVal && fieldVal.statusCode === 400) {
            return fieldVal.message;
        } else if (check && check.statusCode === 400) {
            return check.message;
        } else {
            return "";
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                await setUserProfileAPICall(userId);
            } catch (error) {
                setuserObjData(undefined);
                setLoading(false);
                setErrorText(error.message ? error.message : error);
            }
        }
        if (userId && userId !== undefined && userData.userProfile === null) fetchData();
        if (userData.userProfile) {
            setuserObjData(userData.userProfile);
            setLoading(false);
        }
    }, [userId, userData, setUserProfileAPICall]);

    useEffect(() => {
        if (userObjData) {
            setFirstName(userObjData.firstName);
            setLastName(userObjData.lastName);
            setAge(userObjData.age);
            setAddress(userObjData.address);
            setDOB(formatDate(userObjData.DOB));
            setPhone(userObjData.phone);
            setSex(userObjData.sex);
            setImage(userObjData.photoUrl);
            setImagePreview(null);
        }
    }, [userObjData]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (editMode) {
            setFirstNameError(false);
            setLastNameError(false);
            setAgeError(false);
            setAddressError(false);
            setDOBError(false);
            setPhoneError(false);
            setSexError(false);
            setErrorText("");

            let firstNameCheck = await validation(firstName, helpers.isNameValid(firstName, "FirstName"));
            if (firstNameCheck !== "") {
                setFirstNameError(true);
                setErrorText(firstNameCheck);
                return;
            }

            let lastNameCheck = await validation(lastName, helpers.isNameValid(lastName, "LastName"));
            if (lastNameCheck !== "") {
                setLastNameError(true);
                setErrorText(lastNameCheck);
                return;
            }

            let ageCheck = await validation(age, helpers.isAgeValid(parseInt(age), "Age"));
            if (ageCheck !== "") {
                setAgeError(true);
                setErrorText(ageCheck);
                return;
            }

            if (address) {
                let addressCheck = await validation(address, helpers.isAddressValid(address, "Address"));
                if (addressCheck !== "") {
                    setAddressError(true);
                    setErrorText(addressCheck);
                    return;
                }
            }

            if (phone) {
                let phoneCheck = await validation(phone, helpers.validatePhoneNumber(phone, "Phone"));
                if (phoneCheck !== "") {
                    setPhoneError(true);
                    setErrorText(phoneCheck);
                    return;
                }
            }

            if (dob) {
                let dobCheck = await validation(dob);
                if (dobCheck !== "") {
                    setDOBError(true);
                    setErrorText(dobCheck);
                    return;
                }
            }
            if (sex) {
                if (!validSexArr.includes(sex.toLowerCase())) {
                    setSexError(true);
                    setErrorText("Invalid sex provided");
                    return;
                }
            }

            if (errorText === "") {
                try {
                    let newObj = {};
                    if (userObjData.firstName !== firstName) newObj.firstName = firstName;
                    if (userObjData.lastName !== lastName) newObj.lastName = lastName;
                    if (userObjData.age !== age) newObj.age = age;
                    if (userObjData.address !== address) newObj.address = address;
                    if (userObjData.DOB !== dob) newObj.DOB = dob;
                    if (userObjData.phone !== phone) newObj.phone = phone;
                    if (userObjData.sex !== sex) newObj.sex = sex;

                    if (Object.keys(newObj).length > 0) {
                        await updateUserAPICall(userId, newObj);
                    } else {
                        alert("No fields were changed to save");
                    }
                } catch (error) {
                    alert(error);
                }
            }
        }
        setEditMode(!editMode);
    };

    if (loading) {
        return (
            <div>
                <Loading />
            </div>
        );
    } else if (errorText !== "") {
        return <Alert severity="error">errorText</Alert>;
    } else {
        const commonFields = (
            <div className="container">
                <TextField
                    label="FirstName"
                    onChange={(e) => setFirstName(e.target.value)}
                    variant="filled"
                    color="secondary"
                    inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                    sx={{ mb: 3 }}
                    fullWidth
                    aria-readonly={!editMode}
                    style={{ pointerEvents: editMode ? "auto" : "none" }}
                    InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                    value={firstName}
                    helpertext={firstNameError && errorText}
                    required
                    error={firstNameError}
                />
                <TextField
                    label="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                    variant="filled"
                    color="secondary"
                    inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                    sx={{ mb: 3 }}
                    fullWidth
                    aria-readonly={!editMode}
                    style={{ pointerEvents: !editMode ? "none" : "auto" }}
                    InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                    value={lastName}
                    helpertext={lastNameError && errorText}
                    required
                    error={lastNameError}
                />

                <TextField
                    label="Email"
                    onChange={(e) => setLastName(e.target.value)}
                    variant="filled"
                    color="secondary"
                    inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                    sx={{ mb: 3 }}
                    fullWidth
                    disabled={true}
                    style={{ pointerEvents: !editMode ? "none" : "auto" }}
                    InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                    value={userObjData.email}
                    required
                />

                <TextField
                    label="Age"
                    onChange={(e) => setAge(e.target.value)}
                    variant="filled"
                    color="secondary"
                    inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                    sx={{ mb: 3 }}
                    fullWidth
                    aria-readonly={!editMode}
                    style={{ pointerEvents: !editMode ? "none" : "auto" }}
                    InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                    value={age}
                    helpertext={ageError && errorText}
                    required
                    error={ageError}
                />
                <FormLabel component="legend">Sex</FormLabel>
                <RadioGroup aria-label="sex" name="sex" value={sex} onChange={handleSexChange} disabled={!editMode}>
                    {validSexArr.map((sexOption) => (
                        <FormControlLabel
                            key={sexOption}
                            value={sexOption}
                            control={
                                <Radio
                                    color="secondary"
                                    sx={{
                                        "&.Mui-checked": {
                                            color: "black",
                                        },
                                    }}
                                />
                            }
                            label={sexOption}
                            sx={{
                                "& .MuiFormControlLabel-label": {
                                    color: "black",
                                },
                            }}
                            disabled={!editMode}
                            helpertext={sexError && errorText}
                            error={sexError}
                        />
                    ))}
                </RadioGroup>

                <TextField
                    label="Address"
                    onChange={(e) => setAddress(e.target.value)}
                    variant="filled"
                    color="secondary"
                    inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                    sx={{ mb: 3 }}
                    fullWidth
                    aria-readonly={!editMode}
                    style={{ pointerEvents: !editMode ? "none" : "auto" }}
                    InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                    value={address}
                    helpertext={addressError && errorText}
                    error={addressError}
                />

                <TextField
                    label="Date of Birth"
                    onChange={(e) => setDOB(e.target.value)}
                    variant="filled"
                    color="secondary"
                    inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                    sx={{ mb: 3 }}
                    fullWidth
                    aria-readonly={!editMode}
                    style={{ pointerEvents: !editMode ? "none" : "auto" }}
                    InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                    value={dob}
                    helpertext={dobError && errorText}
                    error={dobError}
                />

                <TextField
                    label="Phone Number"
                    onChange={(e) => setPhone(e.target.value)}
                    variant="filled"
                    color="secondary"
                    inputProps={{ style: { color: "black", background: "#e3e9ff" }, type: "number" }}
                    sx={{ mb: 3 }}
                    fullWidth
                    aria-readonly={!editMode}
                    style={{ pointerEvents: !editMode ? "none" : "auto" }}
                    InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                    value={phone}
                    helpertext={phoneError && errorText}
                    error={phoneError}
                />
            </div>
        );

        return (
            <React.Fragment>
                <div className="profile" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {image ? (
                            <Avatar src={image} alt="Selected Image" sx={{ width: 200, height: 200 }} variant="circular" />
                        ) : imagePreview ? (
                            <Avatar src={imagePreview} alt="Selected Image" sx={{ width: 200, height: 200 }} variant="circular" />
                        ) : (
                            <Avatar src={userObjData.photoUrl} alt={userObjData.name} sx={{ width: 200, height: 200 }} variant="circular" />
                        )}
                        <Button variant="contained" component="label" sx={{ mt: 1, fontSize: "0.8rem" }}>
                            Upload Image
                            <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                        </Button>
                        {imageError && <Typography color="error">{imageError}</Typography>}
                        {imagePreview && (
                            <Button variant="contained" sx={{ mt: 1 }} onClick={handleImageSubmit}>
                                Save Image
                            </Button>
                        )}
                    </Box>

                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" sx={{ mt: 2 }}>
                            {userObjData.firstName + " " + userObjData.lastName}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            {userObjData.profile}
                        </Typography>

                        <Paper sx={{ p: 2 }}>
                            <form autoComplete="off" className="sign-form" onSubmit={handleSubmit}>
                                {commonFields}

                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Button variant="contained" sx={{ mt: 2 }} type="submit">
                                        {editMode ? "Save" : "Edit"}
                                    </Button>
                                </div>
                            </form>
                        </Paper>
                    </Grid>
                </div>
            </React.Fragment>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        userData: state.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUserProfileAPICall: (id) => dispatch(setUserProfileAPICall(id)),
        updateUserAPICall: (id, obj) => dispatch(updateUserAPICall(id, obj)),
        updateProfileImageAPICall: (id, formData) => dispatch(updateProfileImageAPICall(id, formData)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
