import React, { useState, useContext, useEffect } from "react";
import '../App.css';
import { AuthContext } from '../firebase/Auth';
import { Link, Navigate } from "react-router-dom";

const Landing = () => {
  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
    const items = JSON.parse(localStorage.getItem('userData'));
    return <Navigate to='/home' id={items?._id} />;
  }
  return (
    <div>
      <section className="banner">
        <h1>Welcome to our Nurture Nest Website!</h1>
        <p>We provide the best care for your baby</p>
      </section>
      <section className="features">
        <div className="feature">
          <h2>Expert Care</h2>
          <p>Our team of experts is highly trained in caring for babies and will provide the best care possible for your child.</p>
        </div>
        <div className="feature">
          <h2>Personalized Attention</h2>
          <p>We understand that every baby is unique and has different needs. That's why we provide personalized attention to each baby.</p>
        </div>
        <div className="feature">
          <h2>Safe and Secure Environment</h2>
          <p>Our facility is designed to be safe and secure for babies, so you can be sure your child is in good hands.</p>
        </div>
      </section>
      <footer>
        <p className="pColor"> &copy; 2023 Nurture Nest Website</p>
      </footer>
    </div>
  );
};

export default Landing; 
