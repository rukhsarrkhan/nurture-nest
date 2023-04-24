import React from 'react';
import { doSocialSignIn } from '../firebase/FirebaseFunctions';
import { Link, Navigate } from "react-router-dom";

const SocialSignIn = () => {
  const socialSignOn = async (provider) => {
    try {
      await doSocialSignIn(provider);
      return <Navigate to='/login' />;

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

export default SocialSignIn;
