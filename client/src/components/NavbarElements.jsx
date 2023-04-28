import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';
import showProfileDropdown from './Navbar'

export const Nav = styled.nav`
  background: #2c3e50;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  z-index: 12;
  @media screen and (max-width: 768px) {
    height: 60px;
  }
`;

export const NavLink = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: #f1c40f;
  }
  &.active {
    color: #f1c40f;
    font-weight: bold;
  }
`;

export const Bars = styled(FaBars)`
  display: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const ProfileBtn = styled.button`
  border-radius: 50px;
  background: #f1c40f;
  padding: 10px 22px;
  color: #2c3e50;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  margin-left: 24px;
  font-weight: bold;
  position: relative;
  &:hover {
    transition: all 0.2s ease-in-out;
    background: #2c3e50;
    color: #fff;
  }
  @media screen and (max-width: 768px) {
    margin-left: 0;
    padding: 8px 16px;
    font-size: 0.9rem;
  }
`;

export const DropdownMenu = styled.div`
  background-color: #2c3e50;
  position: absolute;
  top: 50px;
  right: 0;
  z-index: 1;
  border-radius: 4px;
  padding: 8px 0;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  min-width: 120px;
`;

export const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #f1c40f;
    `;

    export const ProfileDropdown = styled.div`
    background-color: #2c3e50;
    border-radius: 4px;
    position: absolute;
    top: 60px;
    right: 24px;
    width: 120px;
    display: ${(props) => (showProfileDropdown ? 'block' : 'none')};
    z-index: 1;
  `;

export const ProfileDropdownItem = styled.a`
  color: #fff;
  padding: 8px 12px;
  text-decoration: none;
  display: block;
  &:hover {
    background-color: #f1c40f;
    color: #2c3e50;
  }
`;