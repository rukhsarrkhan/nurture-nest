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
                    <h2>Expert Care</h2>
                    <hr></hr>
                    <p>Our team of experts is highly trained in caring for babies and will provide the best care possible for your child.</p>
                </div>
                <div className="card">
                    <h2>Personalized Attention</h2>
                    <hr></hr>
                    <p>We understand that every baby is unique and has different needs. That's why we provide personalized attention to each baby.</p>
                </div>
                <div className="card">
                    <h2>Safe and Secure Environment</h2>
                    <hr></hr>
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
