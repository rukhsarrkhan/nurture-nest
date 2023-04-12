import React from 'react';
import '../App.css';
import {
  AppBar,
  Typography,
  Link,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Drawer,
} from '@mui/material';

import Logout from './Logout';

const Landing = () => {
  return (
    <><header className='App-header'>
      <Link to='/'>
        {/* <img src={logo} className='App-logo' alt='logo' /> */}
      </Link>
    </header><Logout /></>
  );
};

export default Landing; 