import React, { useState, useContext, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { doSignInWithEmailAndPassword, doPasswordReset, doSignOut } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../firebase/Auth";
import { userLoginAPICall } from "../redux/users/userActions";

import SocialSignIn from "./SocialSignIn";
import helpers from "../helpers";

const Login = ({ userData, userLoginAPICall }) => {
    // NO CONSOLE ERRORS
    // LOADING MISSING
    const { currentUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setSuccess(false);
        if (userData !== undefined) {
            if (userData?.error !== "") {
                setServerError(true);
                setErrorText(userData?.error);
                doSignOut(userData?.error);
            } else {
                if (Object.keys(userData?.data).length !== 0) {
                    setSuccess(true);
                }
            }
        }
    }, [userData]);

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

        setEmailError(false);
        setPasswordError(false);
        setErrorText("");

        let emailCheck = await validation(email, helpers.isEmailValid(email, "Email"));
        if (emailCheck !== "") {
            setEmailError(true);
            setErrorText(emailCheck);
            return;
        }

        let passwordCheck = await validation(password, helpers.isPasswordValid(password, "Password"));
        if (passwordCheck !== "") {
            setPasswordError(true);
            setErrorText(passwordCheck);
            return;
        }

        if (email?.trim() && password?.trim() && errorText === "") {
            const { uid, error, code } = await doSignInWithEmailAndPassword(email?.trim(), password?.trim());
            if (uid !== "") {
                await userLoginAPICall(uid);
            } else {
                if (code === "auth/wrong-password") {
                    setPasswordError(true);
                    setErrorText("Wrong email/password.");
                } else if (code === "auth/user-not-found") {
                    setEmailError(true);
                    setErrorText("User not found.");
                } else {
                    setEmailError(true);
                    setErrorText(`Failed with error code: ${code}`);
                }
            }
        }
    };

    const passwordReset = async (event) => {
        event.preventDefault();
        if (email) {
            const { resp, error, code } = await doPasswordReset(email);
            if (resp !== undefined) {
                alert("Password reset email was sent");
            } else {
                if (code === "auth/user-not-found") {
                    setEmailError(true);
                    setErrorText("User not found.");
                } else {
                    setEmailError(true);
                    setErrorText(`Failed with error code: ${code}`);
                }
            }
        } else {
            setEmailError(true);
            setErrorText("Please enter an email address below before you click the forgot password link");
            return;
        }
    };

    return (
        <React.Fragment>
            <div className="container">
                <form autoComplete="off" onSubmit={handleSubmit} className="sign-form">
                    <h1>Login Form</h1>
                    <TextField
                        label="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        variant="filled"
                        color="secondary"
                        type="email"
                        sx={{ mb: 3 }}
                        fullWidth
                        helperText={emailError && errorText}
                        value={email}
                        error={emailError}
                    />
                    <TextField
                        label="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        variant="filled"
                        color="secondary"
                        type="password"
                        helperText={passwordError && errorText}
                        value={password}
                        error={passwordError}
                        fullWidth
                        sx={{ mb: 3 }}
                    />
                    <br />
                    <br />
                    <div className="centerLogin">
                        <Button variant="outlined" color="secondary" type="submit">
                            Login
                        </Button>
                        <Button variant="outlined" color="secondary" type="submit" onClick={passwordReset}>
                            Forgot Password
                        </Button>
                    </div>
                    <br />
                    {serverError && errorText && (
                        <p id="error-message" className="errorText">
                            {errorText}
                        </p>
                    )}
                </form>
                <br />
                <small>
                    Don't have an account? <Link to="/register">Register here</Link>
                </small>
                <br />
                <SocialSignIn />
            </div>
            {success === true && currentUser && <Navigate to="/home" />}
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        userData: state?.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        userLoginAPICall: (obj) => dispatch(userLoginAPICall(obj)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
