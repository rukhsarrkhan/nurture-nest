import React, { useState, useContext, useEffect } from "react";
import '../App.css';
import Toolbar from "./ToolBar";
import { AuthContext } from '../firebase/Auth';
import { Link, Navigate } from "react-router-dom";

const Landing = () => {
  const { currentUser } = useContext(AuthContext);
  // if (currentUser) {
  //   return <Navigate to='/' />;
  // }
  return (
    <div>
      <Toolbar />
    </div>
  );
};

export default Landing; 
