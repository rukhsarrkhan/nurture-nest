import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import { AuthContext } from "../firebase/Auth";
import "../App.css";
import Landing from "../components/Landing";
import Login from "../components/Login";
import Register from "../components/Register";
import Profile from "../components/Profile/Profile";
import Dashboard from "../components/Dashboard";
import MealList from "../components/MealList";
import VaccineList from "../components/VaccineList";
import AppointmentList from "../components/AppointmentList";
import ChatPage from "./ChatPage";
import Navbar from "../components/Navbar";
import Home from "../components/Home";
import Applicant from "../components/Applicant";
import AllApplicants from "../components/AllApplicants";
import Logout from "../components/Logout";
import MyJob from "./MyJob";
import ViewAllJobs from "./ViewAllJobs";
import ViewJobDetails from "./ViewJobDetails";
import NannyDetails from "./NannyDetails";
import UploadImage from "./UploadImage";
import socketIO from "socket.io-client";
import SetProfile from "./SetProfile";

const socket = socketIO.connect("http://localhost:3000");

const Main = ({ userData }) => {
    const { currentUser } = useContext(AuthContext);
    socket.emit("newUser", { userName: userData?.data?.firstName, socketID: socket?.id });

    return (
        <div className="App">
            <div>
                <header>
                    <Navbar />
                </header>
            </div>
            <div className="App-body">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/dashboard/:childId" element={<Dashboard />} />
                    <Route path="/nanny/:nannyId" element={<NannyDetails />} />
                    <Route path="/meal/:childId" element={<MealList />} />
                    <Route path="/vaccine/:childId" element={<VaccineList />} />
                    <Route path="/appointment/:childId" element={<AppointmentList />} />
                    <Route path="/chat" element={<ChatPage socket={socket} />} />
                    <Route path="/job/allApplicantions/:pageNum" element={<AllApplicants />} /> // can this not be /allApplicantions - SWARAJ
                    <Route path="/job/applications/viewApplication" element={<Applicant />} /> // can this not be /viewApplication - SWARAJ
                    <Route path="/myJob" element={<MyJob />} />
                    <Route path="/job/viewAllJobs/:pageNum" element={<ViewAllJobs />} />
                    <Route path="/job/viewJobDetails" element={<ViewJobDetails />} />
                    <Route path="/uploadImage" element={<UploadImage />} />
                    <Route path="/setProfile" element={<SetProfile />} />
                </Routes>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userData: state?.users,
    };
};

export default connect(mapStateToProps)(Main);
