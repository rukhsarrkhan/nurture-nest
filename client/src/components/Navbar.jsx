import React, { useState } from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  ProfileBtn,
  ProfileDropdown,
  ProfileDropdownItem,
} from './NavbarElements';

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleProfileBtnClick = () => {
    setShowProfileDropdown(prevState => !prevState);
  };

  const handleLogoutClick = () => {
    // Add logout logic here
  };

  return (
    <>
      <Nav>
        <Bars />
        <NavMenu>
          <NavLink to='/dashboard/:nannyId' activeStyle>
            Dashboard
          </NavLink>
          <NavLink to='/applications' activeStyle>
            Applications
          </NavLink>
          <NavLink to='/chat/:chatid' activeStyle>
            Inbox
          </NavLink>
          <NavLink to='/team' activeStyle>
            Manage Child
          </NavLink>
          <NavLink to='/jobs' activeStyle>
            Careers
          </NavLink>
        </NavMenu>
        <NavBtn>
          <ProfileBtn onClick={handleProfileBtnClick}>
            Profile
          </ProfileBtn>
          {showProfileDropdown && (
            <ProfileDropdown>
              <ProfileDropdownItem onClick={handleLogoutClick}>
                Logout
              </ProfileDropdownItem>
            </ProfileDropdown>
          )}
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;