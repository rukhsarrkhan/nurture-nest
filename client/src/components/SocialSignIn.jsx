import React from 'react';
import { doSocialSignIn } from '../firebase/FirebaseFunctions';
import { Navigate } from "react-router-dom";

const SocialSignIn = () => {
  const socialSignOn = async (provider) => {
    try {
      const resp = await doSocialSignIn(provider);
      console.log("resp3", resp);
      return <Navigate to='/dashboard' />;
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
