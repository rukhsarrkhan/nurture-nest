import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { AuthProvider } from "./firebase/Auth";

import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile/Profile";
import ChildList from "./components/ChildList";
import AddChild from "./components/AddChild";
import Dashboard from "./components/Dashboard";
import JobList from "./components/JobList";
import NannyList from "./components/NannyList";
import NannyInfo from "./components/NannyInfo";
import MealList from "./components/MealList";
import VaccineList from "./components/VaccineList";
import AppointmentList from "./components/AppointmentList";
import Chat from "./components/Chat";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    {/* <header className='App-header'>
          <Link to='/'>
            <img src={logo} className='App-logo' alt='logo' />
          </Link>
        </header> */}
                    <div className="App-body">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile/:userId" element={<Profile />} />
                            <Route path="/children/:id" element={<ChildList />} />
                            <Route path="/child/:id" element={<AddChild />} />
                            <Route path="/dashboard/:childId" element={<Dashboard />} />
                            <Route path="/jobs" element={<JobList />} />
                            <Route path="/nannies" element={<NannyList />} />
                            <Route path="/nanny/:id" element={<NannyInfo />} />
                            <Route path="/meal/:childId" element={<MealList />} />
                            <Route path="/vaccine/:childId" element={<VaccineList />} />
                            <Route path="/appointment/:childId" element={<AppointmentList />} />
                            <Route path="/chat/:chatid" element={<Chat />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
