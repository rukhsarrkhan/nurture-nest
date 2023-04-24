
import React, { useState, useContext, useEffect } from "react";
import logo from '../logo.svg';
import '../App.css';
import Landing from '../components/Landing';
import Login from '../components/Login';
import Register from '../components/Register';
import Profile from '../components/Profile';
import ChildList from '../components/ChildList';
import AddChild from '../components/AddChild';
import Dashboard from '../components/Dashboard';
import JobList from '../components/JobList';
import NannyList from '../components/NannyList';
import NannyInfo from '../components/NannyInfo';
import MealList from '../components/MealList';
import VaccineList from '../components/VaccineList';
import AppointmentList from '../components/AppointmentList';
import Chat from '../components/Chat';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

const Main = () => {
    return (
        <div className='App'>
            <div className='App-body'>
                <Routes>
                    <Route path='/' element={<Landing />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/profile/:id' element={<Profile />} />
                    <Route path='/children/:id' element={<ChildList />} />
                    <Route path='/child/:id' element={<AddChild />} />
                    <Route path='/dashboard/:childId' element={<Dashboard />} />
                    <Route path='/jobs' element={<JobList />} />
                    <Route path='/nannies' element={<NannyList />} />
                    <Route path='/nanny/:id' element={<NannyInfo />} />
                    <Route path='/meal/:childId' element={<MealList />} />
                    <Route path='/vaccine/:childId' element={<VaccineList />} />
                    <Route path='/appointment/:childId' element={<AppointmentList />} />
                    <Route path='/chat/:chatid' element={<Chat />} />
                </Routes>
            </div>
        </div>
    );
};

export default Main; 