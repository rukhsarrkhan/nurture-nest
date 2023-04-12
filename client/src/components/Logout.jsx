import React from 'react';
import {doSignOut} from '../firebase/FirebaseFunctions';

const Logout = () => {
    console.log("here")
  return (
    <button type='button' onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default Logout;