
import React, { useState, useContext, useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import { AuthProvider } from './firebase/Auth';
import Main from './components/Main';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

const App = () => {

  return (
    <AuthProvider>
      <Router>
        <Main />
      </Router>
    </AuthProvider>

  );
};

export default App; 