
import React, { useState, useContext } from "react";
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import { AuthContext } from '../firebase/Auth';
import '../App.css';
import Landing from '../components/Landing';
import Login from '../components/Login';
import Register from '../components/Register';
import Profile from '../components/Profile/Profile';
import ChildList from '../components/ChildList';
import AddChild from '../components/AddChild';
import Dashboard from '../components/Dashboard';
import JobList from '../components/JobList';
import NannyList from '../components/NannyList';
import NannyInfo from '../components/NannyInfo';
import MealList from '../components/MealList';
import VaccineList from '../components/VaccineList';
import AppointmentList from '../components/AppointmentList';
import CreateJob from "../components/CreateJob";
import Chat from "../components/Chat";
import Navbar from "../components/Navbar";
import Home from "../components/Home";
import Applicant from '../components/Applicant';
import AllApplicants from '../components/AllApplicants';
import Logout from "../components/Logout";

const Main = ({ userData }) => {
    console.log('userData-----', userData);
    const { currentUser } = useContext(AuthContext);

    const items = JSON.parse(localStorage.getItem('userData'));
    console.log("items-----", items);
    return (
        <div className='App'>
            <div>
                <header>
                    <Navbar />
                </header>
            </div>
            <br></br>
            <div className='App-body'>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    <Route path="/children/:id" element={<ChildList />} />
                    <Route path="/child/:id" element={<AddChild />} />
                    <Route path="/home" element={<Home id={items?._id} />} />
                    <Route path="/dashboard/:childId" element={<Dashboard />} />
                    <Route path="/jobs" element={<JobList />} />
                    <Route path="/nannies" element={<NannyList />} />
                    <Route path="/nanny/:id" element={<NannyInfo />} />
                    <Route path="/meal/:childId" element={<MealList />} />
                    <Route path="/vaccine/:childId" element={<VaccineList />} />
                    <Route path="/appointment/:childId" element={<AppointmentList />} />
                    <Route path="/chat/:chatid" element={<Chat />} />
                    <Route path='/job/:jobId/allApplicants/:pageNum' element={<AllApplicants />} />
                    <Route path='/job/applications/viewApplication' element={<Applicant />} />
                    <Route path="/createJob" element={<CreateJob />} />
                </Routes>
            </div>
        </div >
    );
};

const mapStateToProps = state => {
    return {
        userData: state.users
    };
};

export default connect(
    mapStateToProps
)(Main);
