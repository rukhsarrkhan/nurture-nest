import React from 'react';
import '../App.css';

const ErrorPage = ({ error, code }) => {
    return (
        <div>
            <br />
            <p className='errorText'>Error {code}: {error}. Please refresh.</p>
        </div>
    );
};

export default ErrorPage; 
