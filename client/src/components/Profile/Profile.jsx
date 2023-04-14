import React, { useState, useEffect } from "react";

import "./Profile.css";
import "../../App.css";
import axios from "axios";
import { Link, useParams, useLocation } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, CardHeader } from "@mui/material";

const Profile = (props) => {
    const [profileData, setProfileData] = useState(undefined);
    const [parentData, setParentData] = useState(undefined);
    const [nannyData, useNannyData] = useState(undefined);
    console.log(useParams());

    let { userId } = useParams();
    console.log(userId);
    const location = useLocation();
    useEffect(() => {
        async function fetchData() {
            try {
                console.log("User iD:" + userId);
                const userObj = await axios.get(`http://localhost:3000/users/${userId}`);
                console.log(JSON.stringify(userObj));
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [userId]);

    return <div>hey</div>;
};

export default Profile;
