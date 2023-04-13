import React from 'react';
import {doSocialSignIn} from '../firebase/FirebaseFunctions';

const SocialSignIn = () => {
  const socialSignOn = async (provider) => {
    try {
      await doSocialSignIn(provider);
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
