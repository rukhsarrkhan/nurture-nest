import React, { useState } from 'react';
import { doSocialSignIn } from '../firebase/FirebaseFunctions';
import { Navigate } from "react-router-dom";
import { userLoginAPICall } from '../redux/users/userActions';
import { connect } from 'react-redux';


const SocialSignIn = ({ userLoginAPICall }) => {
  const [serverError, setServerError] = useState(false);

  const [errorText, setErrorText] = useState("");

  const socialSignOn = async (provider) => {
    const { uid, error, code } = await doSocialSignIn(provider);
    if (uid !== "") {
      await userLoginAPICall(uid);
      // what if this fails
      return <Navigate to='/home' id={uid} />;
    } else {
      setServerError(true);
      setErrorText(`Internal Server Error. Please Retry.`);
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
    userLoginAPICall: (obj) => dispatch(userLoginAPICall(obj))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SocialSignIn);
