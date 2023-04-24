import React from 'react';
import { doSignOut } from '../firebase/FirebaseFunctions';
import { Link, Navigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Toolbar from '../components/ToolBar';

const Logout = () => {
  return (
    <div>
      <Toolbar />
      <Button color="inherit" type='button' onClick={doSignOut}>
        Logout
      </Button>
      <Navigate to='/login' />
    </div>
  );
};

export default Logout;
