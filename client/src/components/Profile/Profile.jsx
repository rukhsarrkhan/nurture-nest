import React, { useState, useEffect } from "react";

import "../../App.css";
import { Link, useParams, useLocation } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, CardHeader, Avatar, Box, Grid, Paper, Button, TextField } from "@mui/material";
import helpers from "../../helpers";
import { connect } from "react-redux";
import { setUserProfileAPICall, updateUserAPICall } from "../../redux/users/userActions";

const Profile = ({ userData, setUserProfileAPICall, updateUserAPICall }) => {
    const [userObjData, setuserObjData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");
    const [dob, setDOB] = useState("");
    const [phone, setPhone] = useState("");
    const [n_yearsOfExperience, setExperience] = useState("");
    const [n_qualifications, setQualifications] = useState("");
    const [n_certifications, setCertifications] = useState("");
    const [n_skills, setSkills] = useState("");

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [ageError, setAgeError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [dobError, setDOBError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [experienceError, setExperienceError] = useState(false);
    const [qualificationsError, setQualificationsError] = useState(false);
    const [certificationsError, setCertificationsError] = useState(false);
    const [skillsError, setSkillsError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [error, setError] = useState("");

    let { userId } = useParams();
    console.log(userId);
    let card = null;
    const formatDate = (showdate) => {
        if (showdate) {
            var year = showdate.substring(0, 4);
            var month = showdate.substring(5, 7);
            var day = showdate.substring(8, 10);
            return month + "/" + day + "/" + year;
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
                console.log(error);
                setuserObjData(undefined);
                setLoading(false);
                setError(error.message ? error.message : error);
            }
        }
        if (userId && userId !== undefined && userData.userProfile === null) fetchData();
        if (userData.userProfile) {
            setuserObjData(userData.userProfile);
            setLoading(false);
        }
    }, [userId, userData]);

    useEffect(() => {
        if (userObjData) {
            setFirstName(userObjData.firstName);
            setLastName(userObjData.lastName);
            setAge(userObjData.age);
            setAddress(userObjData.address);
            setDOB(formatDate(userObjData.DOB));
            setPhone(userObjData.phone);
            setExperience(userObjData.n_yearsOfExperience);
            setQualifications(userObjData.n_qualifications);
            setCertifications(userObjData.n_certifications);
            setSkills(userObjData.n_skills);
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
            setExperienceError(false);
            setQualificationsError(false);
            setCertificationsError(false);
            setSkillsError(false);
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

            if (errorText === "") {
                try {
                    let newObj = {};
                    if (userObjData.firstName !== firstName) newObj.firstName = firstName;
                    if (userObjData.lastName !== lastName) newObj.lastName = lastName;
                    if (userObjData.age !== age) newObj.age = age;
                    if (userObjData.address !== address) newObj.address = address;
                    if (userObjData.DOB !== dob) newObj.DOB = dob;
                    if (userObjData.phone !== phone) newObj.phone = phone;

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
                <h2>Loading....</h2>
            </div>
        );
    } else {
        if (!userObjData) {
            return (
                <Link className="showlinkPage" to={`/login`}>
                    Login
                </Link>
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
                        disabled="true"
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
                        inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
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

            const nannyFields = (
                <div className="container">
                    <TextField
                        label="Years of Experience"
                        onChange={(e) => setExperience(e.target.value)}
                        variant="filled"
                        color="secondary"
                        inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                        sx={{ mb: 3 }}
                        fullWidth
                        aria-readonly={!editMode}
                        style={{ pointerEvents: !editMode ? "none" : "auto" }}
                        InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                        value={n_yearsOfExperience}
                        helperText={phoneError && errorText}
                        required
                        error={phoneError}
                    />

                    <TextField
                        label="Qualifications"
                        onChange={(e) => setQualifications(e.target.value)}
                        variant="filled"
                        color="secondary"
                        inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                        sx={{ mb: 3 }}
                        fullWidth
                        aria-readonly={!editMode}
                        style={{ pointerEvents: !editMode ? "none" : "auto" }}
                        InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                        value={n_qualifications}
                    />

                    <TextField
                        label="Certifications"
                        onChange={(e) => setCertifications(e.target.value)}
                        variant="filled"
                        color="secondary"
                        inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                        sx={{ mb: 3 }}
                        fullWidth
                        aria-readonly={!editMode}
                        style={{ pointerEvents: !editMode ? "none" : "auto" }}
                        InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                        value={n_certifications}
                    />

                    <TextField
                        label="Skills"
                        onChange={(e) => setSkills(e.target.value)}
                        variant="filled"
                        color="secondary"
                        inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                        sx={{ mb: 3 }}
                        fullWidth
                        aria-readonly={!editMode}
                        style={{ pointerEvents: !editMode ? "none" : "auto" }}
                        InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                        value={n_skills}
                    />
                </div>
            );

            return (
                <React.Fragment>
                    <div className="profile" style={{ display: "flex", justifyContent: "center" }}>
                        <Grid item xs={12} md={8}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Avatar src={userObjData.photoUrl} alt={userObjData.name} sx={{ width: 200, height: 200 }} variant="circular" />
                            </div>
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
                                <h4>Children:</h4>
                                {userObjData.p_childIds?.map((child) => (
                                    <Card key={child.id} sx={{ mt: 2 }}>
                                        <CardHeader title={child.name} />
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary">
                                                <Link to={`/child/${child.id}`}>View child profile</Link>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Paper>
                        </Grid>
                    </div>
                </React.Fragment>
            );
        }
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
