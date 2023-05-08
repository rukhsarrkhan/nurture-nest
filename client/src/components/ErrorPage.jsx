import React from 'react';
import '../App.css';

const ErrorPage = ({ error, code }) => {
    return (
        <div>
            <br />
            {error !== "" && code !== "" ? (
                <p className='errorText'>Error {code}: {error}. Please refresh.</p>

            ) : (<p className='errorText'>Some Error occured. Please refresh.</p>)
            }
        </div>
    );
};

export default ErrorPage; 
