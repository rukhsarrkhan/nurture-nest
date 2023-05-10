import React from 'react';
import '../App.css';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
  // EVERYTHING DONE

  return (
    <div className='loading'>
      <CircularProgress color="inherit" />
    </div>

  );
};

export default Loading; 
