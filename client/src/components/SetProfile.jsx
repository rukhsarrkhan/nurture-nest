import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../firebase/Auth";
import "../App.css";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { TextField, Button, MenuItem, Typography } from "@mui/material";
import { updateUserAPICall, setUserProfileAPICall } from "../redux/users/userActions";
import Loading from "./Loading";
import helpers from "../helpers";
// import ErrorPage from "../components/ErrorPage";

const profiles = [
    {
        value: "PARENT",
        label: "I'm a Parent. I am looking for help managing my kid(s)",
    },
    {
        value: "NANNY",
        label: "I'm a Nanny. I am looking for a job managing kid(s)",
    },
];
const SetProfile = ({ updateUserAPICall, userData, setUserProfileAPICall }) => {
    const [profileSelected, setProileSelected] = useState(false);
    const [userObjData, setuserObjData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [disableBtn, setdisableBtn] = useState(false);
    const { currentUser } = useContext(AuthContext);
    console.log(userData, " Current UserData");

    const [profile, setProfile] = useState("");

    const [profileError, setProfileError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [error, setError] = useState(false);
    const [errorCode, setErrorCode] = useState("");
    let userId = userData?.data?._id;

    const setUserProfileAPICallMemo = useMemo(() => {
        return () => {
            try {
                setUserProfileAPICall(userId);
            } catch (error) {
                setuserObjData(undefined);
                setLoading(false);
                setErrorText(error.message ? error.message : error);
            }
        };
    }, [userId, setUserProfileAPICall]);

    useEffect(() => {
        setUserProfileAPICallMemo();
    }, [setUserProfileAPICallMemo]);
    useEffect(() => {
        if (userData?.data !== null && userData?.data !== undefined) {
            setuserObjData(userData?.data);
            setLoading(false);
        }
    }, [userData]);

    useEffect(() => {
        if (userObjData) {
            if (userObjData?.profile !== null && userObjData?.profile !== undefined && userObjData?.profile !== "") {
                setProileSelected(true);
            }
        }
    }, [userObjData]);

    const validation = async (field, valFunc) => {
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setdisableBtn(true);
        setProfileError(false);
        setErrorText("");

        let profileCheck = await validation(profile, helpers.isNameValid(profile, "Profile"));
        if (profileCheck !== "" && profile !== "PARENT" && profile !== "NANNY") {
            setProfileError(true);
            setErrorText("Profile is invalid");
            setdisableBtn(false);
            return;
        }
        if (profile?.trim() && errorText === "") {
            let newObj = {};
            newObj.profile = profile;
            try {
                await updateUserAPICall(userObjData._id, newObj);
                setdisableBtn(false);
                setProileSelected(true);
            } catch (e) {
                setErrorText(e.message);
                setError(true);
                setErrorCode(e.statusCode);
                setdisableBtn(false);
            }
        }
    };
    if (!currentUser) {
        return <Navigate to="/" />;
    }
    if (profileSelected) {
        return <Navigate to="/home" />;
    }
    if (loading) {
        return (
            <div>
                <Loading />
            </div>
        );
    }
    // if (error) {
    //     return (
    //         <div>
    //             <ErrorPage error={errorText} code={errorCode} />
    //         </div>
    //     );
    // }

    return (
        <div className="profile" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
                Tell us about yourself. What are you?
            </Typography>
            <form autoComplete="off" className="sign-form" onSubmit={handleSubmit}>
                <TextField
                    label="Profile"
                    defaultValue="PARENT"
                    select
                    required
                    onChange={(e) => setProfile(e.target.value)}
                    variant="filled"
                    color="secondary"
                    helperText={profileError ? errorText : "Please select your profile"}
                    value={profile}
                    error={profileError}
                    fullWidth
                >
                    {profiles.map((option) => (
                        <MenuItem key={option?.value} value={option?.value}>
                            {option?.label}
                        </MenuItem>
                    ))}
                </TextField>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" sx={{ mt: 2 }} type="submit" disabled={disableBtn}>
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userData: state.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateUserAPICall: (id, obj) => dispatch(updateUserAPICall(id, obj)),
        setUserProfileAPICall: (id) => dispatch(setUserProfileAPICall(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetProfile);
