import React, { useState, useEffect } from "react";
import "../App.css";
import { connect } from "react-redux";
import { setUserProfileAPICall, updateProfileImageAPICall, updateUserAPICall } from "../redux/users/userActions";
import Loading from "./Loading";
const SetProfile = () => {};
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
