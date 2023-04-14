import React, { useState } from "react";
import { TextField, FormControl, Button, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { userRegistrationAPICall } from '../redux/users/userActions';

const profiles = [
  {
    value: 'Parent',
    label: 'Parent',
  },
  {
    value: 'Nanny',
    label: 'Nanny',
  },
];

const Register = ({ userData, userRegistrationAPICall }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState();
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [errorText, setErrorText] = useState(false);



  const handleSubmit = (event) => {
    console.log("event",event)
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

    if (password !== confirmPassword) {
      setPasswordError(true);
      setConfirmPasswordError(true);
      return;
    }

    if (firstName && lastName && email && password) {
      console.log("here")
      // make API call
      const data = {
        firstName: firstName,
        lastName: lastName,
        userName: email,
        password: password,
        profile: profile
      };
      userRegistrationAPICall(data);
    }
  };

  return (
    <React.Fragment>
      <div className="container">
        <form autoComplete="off" onSubmit={handleSubmit} className="sign-form">
          <h1>Register Form</h1>
          <TextField
            className="formField"
            label="FirstName"
            onChange={e => setFirstName(e.target.value)}
            required
            variant="outlined"
            color="secondary"
            sx={{ mb: 3 }}
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
            defaultValue="Parent"
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
          <Button variant="outlined" color="secondary" type="submit">Register</Button>

        </form>
        <small>Already have an account? <Link to="/login">Login here</Link></small>
      </div>

    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    userData: state
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