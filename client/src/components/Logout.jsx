import React from 'react';
import {doSignOut} from '../firebase/FirebaseFunctions';

const Logout = () => {
  return (
    <button type='button' onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default Logout;