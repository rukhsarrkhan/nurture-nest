import React, { useState, useEffect } from "react";

import "./Profile.css";
import "../../App.css";
import axios from "axios";
import { Link, useParams, useLocation } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, CardHeader, Avatar, Box, Grid, Paper, Button, TextField } from "@mui/material";
import helpers from "../../helpers";

const Profile = (props) => {
    const [userData, setUserData] = useState(undefined);
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
        var year = showdate.substring(0, 4);
        var month = showdate.substring(5, 7);
        var day = showdate.substring(8, 10);
        return month + "/" + day + "/" + year;
    };
    const toggleEdit = () => {
        setEditMode(!editMode);
    };
    const validation = async (field, valFunc) => {
        let fieldVal = await helpers.execValdnAndTrim(field);
        let check = await valFunc;
        if (check && check.statusCode === 400) {
            return check.message;
        } else {
            return "";
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
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

        // if (firstName.trim() && lastName.trim() && email.trim() && password.trim() && errorText === "") {
        //     try {
        //         const resp = await doCreateUserWithEmailAndPassword(email.trim(), password.trim(), firstName.trim());
        //         const data = {
        //             firstName: firstName.trim(),
        //             lastName: lastName.trim(),
        //             email: email.trim(),
        //             profile: profile.trim(),
        //             age: age,
        //         };
        //         await userRegistrationAPICall(data);
        //     } catch (error) {
        //         alert(error);
        //     }
        // }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:3000/users/${userId}`);
                console.log(data);
                setUserData(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setUserData(undefined);
                setLoading(false);
                setError(error.message ? error.message : error);
            }
        }
        if (userId && userId !== undefined) fetchData();
    }, [userId]);
    useEffect(() => {
        if (userData) {
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setAge(userData.age);
            setAddress(userData.address);
            setDOB(userData.DOB);
            setPhone(userData.phone);
            setExperience(userData.n_yearsOfExperience);
            setQualifications(userData.n_qualifications);
            setCertifications(userData.n_certifications);
            setSkills(userData.n_skills);
        }
    }, userData);

    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
    } else {
        if (!userData) {
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
                        filled
                        inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                        sx={{ mb: 3 }}
                        fullWidth
                        aria-readonly={!editMode}
                        style={{ pointerEvents: editMode ? "auto" : "none" }}
                        InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                        // helperText={firstNameError && errorText}
                        value={firstName}
                        // error={firstNameError}
                    />
                    <TextField
                        label="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                        variant="filled"
                        color="secondary"
                        filled
                        inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                        sx={{ mb: 3 }}
                        fullWidth
                        aria-readonly={!editMode}
                        style={{ pointerEvents: !editMode ? "none" : "auto" }}
                        InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                        value={lastName}
                    />

                    <TextField
                        label="Age"
                        onChange={(e) => setAge(e.target.value)}
                        variant="filled"
                        color="secondary"
                        filled
                        inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                        sx={{ mb: 3 }}
                        fullWidth
                        aria-readonly={!editMode}
                        style={{ pointerEvents: !editMode ? "none" : "auto" }}
                        InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                        value={age}
                    />

                    <TextField
                        label="Address"
                        onChange={(e) => setAddress(e.target.value)}
                        variant="filled"
                        color="secondary"
                        filled
                        inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                        sx={{ mb: 3 }}
                        fullWidth
                        aria-readonly={!editMode}
                        style={{ pointerEvents: !editMode ? "none" : "auto" }}
                        InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                        value={address}
                    />

                    <TextField
                        label="Date of Birth"
                        onChange={(e) => setDOB(e.target.value)}
                        variant="filled"
                        color="secondary"
                        filled
                        inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                        sx={{ mb: 3 }}
                        fullWidth
                        aria-readonly={!editMode}
                        style={{ pointerEvents: !editMode ? "none" : "auto" }}
                        InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                        value={dob}
                    />

                    <TextField
                        label="Phone Number"
                        onChange={(e) => setPhone(e.target.value)}
                        variant="filled"
                        color="secondary"
                        filled
                        inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                        sx={{ mb: 3 }}
                        fullWidth
                        aria-readonly={!editMode}
                        style={{ pointerEvents: !editMode ? "none" : "auto" }}
                        InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                        value={phone}
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
                        filled
                        inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
                        sx={{ mb: 3 }}
                        fullWidth
                        aria-readonly={!editMode}
                        style={{ pointerEvents: !editMode ? "none" : "auto" }}
                        InputLabelProps={{ style: { pointerEvents: !editMode ? "none" : "auto" } }}
                        value={n_yearsOfExperience}
                    />

                    <TextField
                        label="Qualifications"
                        onChange={(e) => setQualifications(e.target.value)}
                        variant="filled"
                        color="secondary"
                        filled
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
                        filled
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
                        filled
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
                    <div className="profile">
                        <Grid item xs={12} md={8}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Avatar src={userData.photoUrl} alt={userData.name} sx={{ width: 200, height: 200 }} variant="circular" />
                            </div>
                            <Typography variant="h4" sx={{ mt: 2 }}>
                                {userData.firstName + " " + userData.lastName}
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 1 }}>
                                {userData.profile}
                            </Typography>
                            <form autoComplete="off" className="sign-form" onSubmit={handleSubmit}></form>
                            <Paper sx={{ p: 2 }}>
                                <Box component="ul">
                                    {commonFields}
                                    {userData.profile === "NANNY" && nannyFields}
                                    <h4>Children:</h4>
                                    {userData.p_childIds?.map((child) => (
                                        <Card key={child.id} sx={{ mt: 2 }}>
                                            <CardHeader title={child.name} />
                                            <CardContent>
                                                <Typography variant="body2" color="text.secondary">
                                                    <Link to={`/child/${child.id}`}>View child profile</Link>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>
                        <Button variant="contained" sx={{ mt: 2 }} onClick={toggleEdit}>
                            {editMode ? "Save" : "Edit"}
                        </Button>
                    </div>
                </React.Fragment>
            );
        }
    }
};

export default Profile;
