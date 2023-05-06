import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from 'react-redux';
import { TextField, Button, MenuItem } from "@mui/material";
import { userRegistrationAPICall } from '../redux/users/userActions';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../firebase/Auth';
import SocialSignIn from './SocialSignIn';
import helpers from '../helpers';

const profiles = [
  {
    value: 'PARENT',
    label: 'PARENT',
  },
  {
    value: 'NANNY',
    label: 'NANNY',
  },
];

const Register = ({ userData, userRegistrationAPICall }) => {
  const { currentUser } = useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState("");
  const [age, setAge] = useState(1);

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [errorText, setErrorText] = useState("");

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

    setFirstNameError(false);
    setLastNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    setProfileError(false);
    setAgeError(false);
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

    let confirmPasswordCheck = await validation(confirmPassword, helpers.isPasswordValid(confirmPassword, "Confirm Password"));
    if (confirmPasswordCheck !== "") {
      setConfirmPasswordError(true);
      setErrorText(confirmPasswordCheck);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(true);
      setConfirmPasswordError(true);
      setErrorText("Passwords should match");
      return;
    }

    let profileCheck = await validation(profile, helpers.isNameValid(profile, "Profile"));
    if (profileCheck !== "" && profile !== "PARENT" && profile !== "NANNY") {
      setProfileError(true);
      setErrorText("Profile is invalid");
      return;
    }

    let ageCheck = await validation(age, helpers.isAgeValid(parseInt(age), "Age"));
    if (ageCheck !== "") {
      setAgeError(true);
      setErrorText(ageCheck);
      return;

    }

    if (firstName?.trim() && lastName?.trim() && email?.trim() && password?.trim() && errorText === "") {
      let uuid;

      const { uid, error, code } = await doCreateUserWithEmailAndPassword(
        email?.trim(),
        password?.trim(),
        firstName?.trim()
      );

      if (uid !== "") {
        uuid = uid;
      } else {
        if (code === 'auth/weak-password') {
          setPasswordError(true);
          setErrorText("The password is too weak.");
        } else if (code === 'auth/email-already-in-use') {
          setEmailError(true);
          setErrorText("Email already in use.");
        } else {
          setEmailError(true);
          setErrorText(`Failed with error code: ${code}`);
        }
      }

      try {
        const data = {
          firstName: firstName?.trim(),
          lastName: lastName?.trim(),
          email: email?.trim(),
          profile: profile?.trim(),
          age: age,
          uuid: uuid
        };
        await userRegistrationAPICall(data);
      } catch (error) {
        alert(error);
      }

      return <Navigate to='/login' />;
    }
  };

  if (currentUser) {
    const items = JSON.parse(localStorage.getItem('userData'));
    return <Navigate to='/home' id={items?._id} />;
  }

  return (
    <React.Fragment>
      <div className="container">

        <form autoComplete="off" onSubmit={handleSubmit} className="sign-form">
          <h1>Register Form</h1>
          <TextField
            label="FirstName"
            onChange={e => setFirstName(e.target.value)}
            required
            variant="filled"
            color="secondary"
            sx={{ mb: 3 }}
            fullWidth
            helperText={firstNameError && errorText}
            value={firstName}
            error={firstNameError}
          />
          <TextField
            label="LastName"
            onChange={e => setLastName(e.target.value)}
            required
            variant="filled"
            color="secondary"
            sx={{ mb: 3 }}
            fullWidth
            helperText={lastNameError && errorText}
            value={lastName}
            error={lastNameError}
          />
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
          <TextField
            label="ConfirmPassword"
            onChange={e => setConfirmPassword(e.target.value)}
            required
            variant="filled" color="secondary"
            type="password"
            helperText={confirmPasswordError && errorText}
            value={confirmPassword}
            error={confirmPasswordError}
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="Profile"
            defaultValue="PARENT"
            select
            required
            onChange={e => setProfile(e.target.value)}
            variant="filled" color="secondary"
            helperText={profileError ? errorText : "Please select your profile"}
            value={profile}
            error={profileError}
            fullWidth
            sx={{ mb: 3 }}
          >
            {profiles.map((option) => (
              <MenuItem key={option?.value} value={option?.value}>
                {option?.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Age"
            onChange={e => setAge(e.target.value)}
            required
            variant="filled" color="secondary"
            type="number"
            helperText={ageError && errorText}
            value={age}
            error={ageError}
            fullWidth
            sx={{ mb: 3 }}
          />
          <br />
          <br />

          <Button variant="outlined" color="secondary" type="submit" className="center">Register</Button>

        </form>
        <small>Already have an account? <Link to="/login">Login here</Link></small>
        <br />
        <SocialSignIn />
      </div>

    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    userData: state?.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userRegistrationAPICall: (obj) => dispatch(userRegistrationAPICall(obj))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
