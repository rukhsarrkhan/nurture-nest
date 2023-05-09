import React, { useState } from 'react';
import { doSocialSignIn, doSignOut } from '../firebase/FirebaseFunctions';
import { Navigate } from "react-router-dom";
import { userLoginAPICall } from '../redux/users/userActions';
import { connect } from 'react-redux';


const SocialSignIn = ({ userData, userLoginAPICall }) => {
  const [serverError, setServerError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const socialSignOn = async (provider) => {
    const { uid, error, code, email, firstName, lastName } = await doSocialSignIn(provider);
    if (uid !== "") {
      await userLoginAPICall(uid, email, firstName, lastName);
      return <Navigate to="/home" />;
    } else {
      setServerError(true);
      setErrorText(`Internal Server Error. Please Retry.`);
      doSignOut();
    }
  };
  return (
    <div>
      <small>or</small>
      <br />
      <img
        onClick={() => socialSignOn('google')}
        alt='google signin'
        src='/images/btn_google_signin.png'
      />
      <br />
      {serverError && errorText && < p id="error-message" className="errorText" >{errorText}</p>}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    userData: state?.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userLoginAPICall: (obj, email, firstName, lastName) => dispatch(userLoginAPICall(obj, email, firstName, lastName))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SocialSignIn);
