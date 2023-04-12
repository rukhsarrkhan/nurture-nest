import React, { useState, useContext, useEffect } from "react";
import { TextField, FormControl, Button, MenuItem } from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { connect } from 'react-redux';
import { userRegistrationAPICall } from '../redux/users/userActions';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../firebase/Auth';
import SocialSignIn from './SocialSignIn';


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
  console.log("currentUser here", currentUser);
  console.log("userData here", userData);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState();
  const [age, setAge] = useState();
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [ageError, setAgeError] = useState(false);

  const [errorText, setErrorText] = useState(false);



  useEffect(() => {
    

  }, []);

  const handleSubmit = async (event) => {
    console.log("event", event);
    event.preventDefault();

    setFirstNameError(false);
    setLastNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    setProfileError(false);

    if (firstName === '') {
      setFirstNameError(true);
    }
    if (lastName === '') {
      setLastNameError(true);
    }
    if (email === '') {
      setEmailError(true);
    }
    if (password === '') {
      setPasswordError(true);
    }
    if (confirmPassword === '') {
      setConfirmPasswordError(true);
    }
    // if (profile === '') {
    //   setProfileError(true);
    // }

    if (age === '') {
      setAgeError(true);
    }

    if (password !== confirmPassword) {
      setPasswordError(true);
      setConfirmPasswordError(true);
      return;
    }

    if (firstName && lastName && email && password) {
      console.log("here");
      try {
        await doCreateUserWithEmailAndPassword(
          email,
          password,
          firstName
        );
        const data = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          profile: profile,
          age: age
        };
        userRegistrationAPICall(data);
      } catch (error) {
        alert(error);
      }
    }
  };

  if (currentUser) {
    return <Navigate to='/' />;
  }

  return (
    <React.Fragment>
      <div className="container">
        <form autoComplete="off" onSubmit={handleSubmit} className="sign-form">
          <h1>Register Form</h1>
          <TextField
            // className="formField"
            label="FirstName"
            onChange={e => setFirstName(e.target.value)}
            required
            variant="outlined"
            color="secondary"
            // inputProps={{ style: { color: "black", background: "#e3e9ff" } }}
            sx={{ mb: 3  }}
            fullWidth
            value={firstName}
            error={firstNameError}
          />
          <TextField
            label="LastName"
            onChange={e => setLastName(e.target.value)}
            required
            variant="outlined"
            color="secondary"
            sx={{ mb: 3 }}
            fullWidth
            value={lastName}
            error={lastNameError}
          />
          <TextField
            label="Email"
            onChange={e => setEmail(e.target.value)}
            required
            variant="outlined"
            color="secondary"
            type="email"
            sx={{ mb: 3 }}
            fullWidth
            value={email}
            error={emailError}
          />
          <TextField
            label="Password"
            onChange={e => setPassword(e.target.value)}
            required
            variant="outlined"
            color="secondary"
            type="password"
            value={password}
            error={passwordError}
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="ConfirmPassword"
            onChange={e => setConfirmPassword(e.target.value)}
            required
            variant="outlined"
            color="secondary"
            type="password"
            value={confirmPassword}
            error={confirmPasswordError}
            fullWidth
            sx={{ mb: 3 }}
          />
          <TextField
            label="Profile"
            defaultValue="PARENT"
            helperText="Please select your profile"
            select
            required
            onChange={e => setProfile(e.target.value)}
            variant="outlined"
            color="secondary"
            value={profile}
            error={profileError}
            fullWidth
            sx={{ mb: 3 }}
          >
            {profiles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Age"
            onChange={e => setAge(e.target.value)}
            required
            variant="outlined"
            color="secondary"
            type="number"
            value={age}
            error={ageError}
            fullWidth
            sx={{ mb: 3 }}
          />
          <Button variant="outlined" color="secondary" type="submit">Register</Button>

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
    userData: state.users
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