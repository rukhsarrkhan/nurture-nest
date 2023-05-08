import React, { useState, useEffect, useCallback } from "react";

import "../../App.css";
import { Typography, Avatar, Grid, Paper, Button, TextField, Box, MenuItem } from "@mui/material";
import helpers from "../../helpers";
import { connect } from "react-redux";
import { setUserProfileAPICall, updateProfileImageAPICall, updateUserAPICall } from "../../redux/users/userActions";
import Loading from "../Loading";
// import axios from "axios";

const sexes = [
    {
        value: "Male",
        label: "Male",
    },
    {
        value: "Female",
        label: "Female",
    },
    {
        value: "Non-Binary",
        label: "Non-Binary",
    },
    {
        value: "Transgender",
        label: "Transgender",
    },
    {
        value: "Other",
        label: "Other",
    },
];

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
    const [disableSave, setDisableSave] = useState(false);
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
    const validSexArr = ["Male", "Female", "Non-Binary", "Transgender", "Other"];

    let userId = userData?.userProfile?._id;
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
        try {
            setDisableSave(true);
            if (!imageFile) {
                setImageError("No image available");
                setImagePreview(null);
                return;
            }
            const formData = new FormData();
            formData.append("image", imageFile);

            await updateProfileImageAPICall(userId, formData);
            // const response = await axios.put("http://localhost:3000/users/image", formData);
            setDisableSave(false);
        } catch (error) {
            console.error(error);
            setDisableSave(false);
        }
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

    const setVariablesFromUserObj = useCallback((value) => {
        if (value) {
            if (value?.firstName !== undefined && value?.firstName !== "" && value?.firstName !== null) {
                setFirstName(value.firstName);
            }
            if (value?.lastName !== undefined && value?.lastName !== "" && value?.lastName !== null) {
                setLastName(value.lastName);
            }
            if (value?.age !== undefined && value?.age !== "" && value?.age !== null) {
                setAge(value.age);
            }
            if (value?.address !== undefined && value?.address !== "" && value?.address !== null) {
                setAddress(value.address);
            }
            if (value?.DOB !== undefined && value?.DOB !== "" && value?.DOB !== null) {
                setDOB(formatDate(value.DOB));
            }
            if (value?.phone !== undefined && value?.phone !== "" && value?.phone !== null) {
                setPhone(value.phone);
            }
            if (value?.sex !== undefined && value?.sex !== "" && value?.sex !== null) {
                setSex(value.sex);
            }
            if (value?.photoUrl !== undefined && value?.photoUrl !== "" && value?.photoUrl !== null) {
                setImage(value.photoUrl);
                setImagePreview(null);
            }
        }
    }, []);

    useEffect(() => {
        setVariablesFromUserObj(userObjData);
    }, [userObjData, setVariablesFromUserObj]);

    const handleEdit = (event) => {
        event.preventDefault();
        setEditMode(true);
    };

    const handleCancel = (event) => {
        event.preventDefault();
        setEditMode(false);
        setVariablesFromUserObj(userObjData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setDisableSave(true);
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
                setDisableSave(false);
                return;
            }

            let lastNameCheck = await validation(lastName, helpers.isNameValid(lastName, "LastName"));
            if (lastNameCheck !== "") {
                setLastNameError(true);
                setErrorText(lastNameCheck);
                setDisableSave(false);
                return;
            }

            let ageCheck = await validation(age, helpers.isAgeValid(parseInt(age), "Age"));
            if (ageCheck !== "") {
                setAgeError(true);
                setErrorText(ageCheck);
                setDisableSave(false);
                return;
            }

            if (address) {
                let addressCheck = await validation(address, helpers.isAddressValid(address, "Address"));
                if (addressCheck !== "") {
                    setAddressError(true);
                    setErrorText(addressCheck);
                    setDisableSave(false);
                    return;
                }
            }

            if (phone) {
                let phoneCheck = await validation(phone, helpers.validatePhoneNumber(phone, "Phone"));
                if (phoneCheck !== "") {
                    setPhoneError(true);
                    setErrorText(phoneCheck);
                    setDisableSave(false);
                    return;
                }
            }

            if (dob) {
                let dobCheck = await validation(dob);
                if (dobCheck !== "") {
                    setDOBError(true);
                    setErrorText(dobCheck);
                    setDisableSave(false);
                    return;
                }
            }
            if (sex) {
                if (!validSexArr.includes(sex)) {
                    setSexError(true);
                    setErrorText("Invalid sex provided");
                    setDisableSave(false);
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
                        setDisableSave(false);
                    } else {
                        alert("No fields were changed to save");
                        setDisableSave(false);
                    }
                } catch (error) {
                    alert(error);
                    setDisableSave(false);
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
                    helperText={firstNameError && errorText}
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
                    helperText={lastNameError && errorText}
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
                    helperText={ageError && errorText}
                    required
                    error={ageError}
                />
                <TextField
                    label="Sex"
                    defaultValue={sex}
                    select
                    onChange={(e) => setSex(e.target.value)}
                    variant="filled"
                    color="secondary"
                    helperText={sexError ? errorText : "Please select your profile"}
                    value={sex}
                    error={sexError}
                    aria-readonly={!editMode}
                    style={{ pointerEvents: !editMode ? "none" : "auto" }}
                    fullWidth
                >
                    {sexes.map((option) => (
                        <MenuItem key={option?.value} value={option?.value}>
                            {option?.label}
                        </MenuItem>
                    ))}
                </TextField>

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
                    helperText={addressError && errorText}
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
                    helperText={dobError && errorText}
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
                    helperText={phoneError && errorText}
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
                            <Button variant="contained" sx={{ mt: 1 }} onClick={handleImageSubmit} disabled={disableSave}>
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
                                    {editMode ? (
                                        <>
                                            <Button variant="contained" sx={{ mt: 2, mr: 1 }} type="submit" disabled={disableSave}>
                                                Save
                                            </Button>
                                            <Button variant="contained" sx={{ mt: 2 }} onClick={handleCancel}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="contained" sx={{ mt: 2 }} onClick={handleEdit}>
                                            Edit
                                        </Button>
                                    )}
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
