import React, { useState, useContext, useEffect } from "react";
import { TextField, FormControl, Button, MenuItem } from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { connect } from 'react-redux';
import { doSignInWithEmailAndPassword, doPasswordReset } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../firebase/Auth';
import SocialSignIn from './SocialSignIn';
import helpers from '../helpers';

const Login = ({ userData }) => {
  const { currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorText, setErrorText] = useState("");

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

    if (email.trim() && password.trim() && errorText === "") {
      try {
        await doSignInWithEmailAndPassword(
          email.trim(),
          password.trim()
        );
      } catch (error) {
        alert(error);
      }
    }
    return <Navigate to='/' />;

  };

  const passwordReset = async (event) => {
    event.preventDefault();
    if (email) {
      doPasswordReset(email);
      alert('Password reset email was sent');
    } else {
      alert(
        'Please enter an email address below before you click the forgot password link'
      );
    }
  };

  if (currentUser) {
    return <Navigate to='/' />;
  }

  return (
    <React.Fragment>
      <div className="container">
        <form autoComplete="off" onSubmit={handleSubmit} className="sign-form">
          <h1>Login Form</h1>
          <TextField
            label="Email"
            onChange={e => setEmail(e.target.value)}
            required
            variant="filled" color="secondary"
            type="email"
            sx={{ mb: 3 }}
            fullWidth
            helperText={emailError && errorText}
            value={email}
            error={emailError}
          />
          <TextField
            label="Password"
            onChange={e => setPassword(e.target.value)}
            required
            variant="filled" color="secondary"
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
            <Button variant="outlined" color="secondary" type="submit" >Login</Button>
            <Button variant="outlined" color="secondary" type="submit" onClick={passwordReset} >Forgot Password</Button>
          </div>
        </form>
        <br />

        <small>Don't have an account? <Link to="/register">Register here</Link></small>
        <br />
        <SocialSignIn />
      </div>

    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    userData: state.users
  };
};

export default connect(
  mapStateToProps,
)(Login);
