import React from 'react';
import { doSocialSignIn } from '../firebase/FirebaseFunctions';
import { Navigate } from "react-router-dom";
import { userLoginAPICall } from '../redux/users/userActions';
import { connect } from 'react-redux';


const SocialSignIn = ({ userLoginAPICall }) => {
  const socialSignOn = async (provider) => {
    try {
      const resp = await doSocialSignIn(provider);
      await userLoginAPICall(resp);
      return <Navigate to='/home' id={resp} />;
    } catch (error) {
      alert(error);
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
