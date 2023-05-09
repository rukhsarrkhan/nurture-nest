import React, { useContext } from "react";
import "../App.css";
import { AuthContext } from "../firebase/Auth";
import { Navigate } from "react-router-dom";

const Landing = () => {
    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return <Navigate to="/home" />;
    }
    return (
        <div>
            <section className="hero">
                <h1>WELCOME TO NURTURE NEST! </h1>
                <blockquote>"The best care for your baby "</blockquote>
            </section>
            <section className="card-container">
                <div className="card">
                    <h2>Personalized Managing</h2>
                    <hr></hr>
                    <p>You can now leave the worry of noting everything down and use our app to manage your child!</p>
                    <hr></hr>
                </div>
                <div className="card">
                    <h2>Personalized Attention</h2>
                    <hr></hr>
                    <p>You can now keep track of the vaccine information, meal plans and doctor's appointments</p>
                    <hr></hr>
                </div>
                <div className="card">
                    <h2>Personalized Nanny Hiring</h2>
                    <hr></hr>
                    <p>Our facility is designed to be safe and secure for you to find nannies for your child with in built chat feature.</p>
                    <hr></hr>
                </div>
            </section>
            <footer>
                <p className="pColor"> &copy; 2023 Nurture Nest Website</p>
            </footer>
        </div>
    );
};

export default Landing; 
