import React, { useContext, useState } from "react";
import '../App.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from '../firebase/Auth';
import { doSignOut } from '../firebase/FirebaseFunctions';

import Logout from "./Logout";

const ToolBar = () => {
  const { currentUser } = useContext(AuthContext);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [showRegisterButton, setShowRegisterButton] = useState(false);
  const [showLogoutButton, setShowLogoutButton] = useState(false);

  const handleLoginButton = () => {
    setShowLoginButton(true);
  };
  const handleRegisterButton = () => {
    setShowRegisterButton(true);
  };
  const handleLogoutButton = () => {
    setShowLogoutButton(true);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          {/* <MenuIcon /> */}
        </IconButton>
        {!currentUser && <Button color="inherit" onClick={handleLoginButton}>Login</Button>}
        {!currentUser && <Button color="inherit" onClick={handleRegisterButton}>Register</Button>}
        {currentUser && <Button color="inherit" type='button' onClick={doSignOut}>Logout</Button>}
        {showLoginButton && (
          <Navigate to='/login' />
        )}
        {showRegisterButton && (
          <Navigate to='/register' />
        )}
        {showLogoutButton && (
          <Logout />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ToolBar; 
