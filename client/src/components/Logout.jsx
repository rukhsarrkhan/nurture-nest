import React from 'react';
import { doSignOut } from '../firebase/FirebaseFunctions';
import Button from '@mui/material/Button';

const Logout = () => {
  return (
    <div>
      <Button color="inherit" type='button' onClick={doSignOut}>
        Logout
      </Button>
    </div>
  );
};

export default Logout;
