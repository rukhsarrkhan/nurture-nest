import React, { useContext } from "react";
import { connect } from "react-redux";
import { AuthContext } from "../firebase/Auth";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { Nav, NavLink, Bars, NavMenu, NavBtn, ProfileBtn } from "./NavbarElements";

const Navbar = ({ userData }) => {
    const { currentUser } = useContext(AuthContext);

    return (
        <>
            <Nav>
                <Bars />
                <NavMenu>
                    {currentUser && <NavLink to="/home">Home</NavLink>}
                    {currentUser && <NavLink to="/chat">Inbox</NavLink>}
                    {currentUser && userData?.data?.profile === "NANNY" && (
                        <NavLink to="/job/viewAllJobs/1" >
                            Careers
                        </NavLink>
                    )}{" "}
                </NavMenu>
                <NavBtn>
                    {!currentUser && (
                        <ProfileBtn>
                            <NavLink to="/login">Login</NavLink>
                        </ProfileBtn>
                    )}
                    {!currentUser && (
                        <ProfileBtn>
                            <NavLink to="/register">Register</NavLink>
                        </ProfileBtn>
                    )}
                    {currentUser && (
                        <ProfileBtn>
                            <NavLink to="/profile">Profile</NavLink>
                        </ProfileBtn>
                    )}
                    {currentUser && <ProfileBtn onClick={doSignOut}>Logout</ProfileBtn>}
                </NavBtn>
            </Nav>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        userData: state?.users,
    };
};

export default connect(mapStateToProps)(Navbar);
