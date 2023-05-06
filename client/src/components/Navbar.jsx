import React, { useContext } from "react";
import { connect } from 'react-redux';
import { AuthContext } from '../firebase/Auth';
import { doSignOut } from '../firebase/FirebaseFunctions';
import { Nav, NavLink, Bars, NavMenu, NavBtn, ProfileBtn } from './NavbarElements';

const Navbar = ({ userData }) => {
  const { currentUser } = useContext(AuthContext);
  let items = JSON.parse(localStorage.getItem('userData'));
  const profileLink = `/profile/${items?._id}`;

  return (
    <>
      <Nav>
        <Bars />
        <NavMenu>
          {currentUser &&  <NavLink to='/home' id={items?._id} activeStyle>
            Home
          </NavLink>}
          {/* {currentUser && items?.profile === "PARENT" && <NavLink to='/applications' activeStyle>
            Applications
          </NavLink>} */}
          {currentUser && <NavLink to='/chat' activeStyle>
            Inbox
          </NavLink>}
          {currentUser &&  items?.profile === "NANNY" &&<NavLink to='/jobs' activeStyle>
            Careers
          </NavLink>}
        </NavMenu>
        <NavBtn>
          {!currentUser && <ProfileBtn>
            <NavLink to='/login' activeStyle>
              Login
            </NavLink>
          </ProfileBtn>}
          {!currentUser && <ProfileBtn>
            <NavLink to='/register' activeStyle>
              Register
            </NavLink>
          </ProfileBtn>}
          {currentUser && <ProfileBtn>
            <NavLink to={profileLink} activeStyle>
              Profile
            </NavLink>
          </ProfileBtn>}
          {currentUser && <ProfileBtn onClick={doSignOut}>
            Logout
          </ProfileBtn>}
        </NavBtn>
      </Nav>
    </>
  );
};

const mapStateToProps = state => {
  return {
    userData: state?.users
  };
};

export default connect(
  mapStateToProps
)(Navbar);
