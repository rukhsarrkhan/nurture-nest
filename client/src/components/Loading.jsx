import React from 'react';
import '../App.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = () => {
  return (
    <div className='loading'>
      <CircularProgress color="inherit" />
    </div>

  );
};

export default Loading; 