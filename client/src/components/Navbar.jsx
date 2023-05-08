import React, { useContext } from "react";
import { connect } from "react-redux";
import { AuthContext } from "../firebase/Auth";
import { doSignOut } from "../firebase/FirebaseFunctions";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  ProfileBtn,
} from "./NavbarElements";

const Navbar = ({ userData }) => {
  const { currentUser } = useContext(AuthContext);
  let items = JSON.parse(localStorage.getItem("userData"));
  const profileLink = `/profile/${items?._id}`;
  console.log("items", items);

  return (
    <>
      <Nav>
        <Bars />
        <NavMenu>
          {currentUser && (
            <NavLink to="/home" id={items?._id}>
              Home
            </NavLink>
          )}
          {/* {currentUser && items?.profile === "PARENT" && <NavLink to='/applications' >
            Applications
          </NavLink>} */}
          {currentUser && <NavLink to="/chat">Inbox</NavLink>}
          {currentUser && items?.profile === "NANNY" && (
            <NavLink to="/job/viewAllJobs/1" id={items?._id}>
              Careers
            </NavLink>
          )}
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
              <NavLink to={profileLink}>Profile</NavLink>
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
