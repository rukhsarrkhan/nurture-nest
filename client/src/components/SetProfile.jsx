import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../firebase/Auth";
import "../App.css";
import { connect } from "react-redux";
import { redirect } from "react-router-dom";
import { setUserProfileAPICall, updateProfileImageAPICall, updateUserAPICall } from "../redux/users/userActions";
import Loading from "./Loading";
const SetProfile = ({ updateUserAPICall, userData }) => {
    const [profileSelected, setProileSelected] = useState(false);
    const [userObjData, setuserObjData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useContext(AuthContext);
    const [selectedOption, setSelectedOption] = useState("");
    useEffect(() => {
        if (userData?.userProfile !== null && userData?.userProfile !== undefined) {
            setuserObjData(userData?.userProfile);
            setLoading(false);
            if (userData?.userProfile?.profile !== null && userData?.userProfile?.profile !== undefined && userData?.userProfile?.profile !== "") {
                setProileSelected(true);
            }
        }
    }, [userData]);

    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);

        // Call backend API with selected value and user ID
        // fetch(`/api/profile/${props.userId}`, {
        //     method: "POST",
        //     body: JSON.stringify({ profile: selectedValue }),
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // })
        //     .then((response) => response.json())
        //     .then((data) => console.log(data))
        //     .catch((error) => console.error(error));
    };
    if (!currentUser) {
        redirect("/");
    }
    if (profileSelected) {
        redirect("/home");
    }
    if (loading) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    return (
        <div>
            <h2>Select a profile:</h2>
            <label>
                <input type="radio" value="parent" checked={selectedOption === "parent"} onChange={handleOptionChange} />
                Parent
            </label>
            <label>
                <input type="radio" value="nanny" checked={selectedOption === "nanny"} onChange={handleOptionChange} />
                Nanny
            </label>
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        userData: state.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateUserAPICall: (id, obj) => dispatch(updateUserAPICall(id, obj)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SetProfile);
