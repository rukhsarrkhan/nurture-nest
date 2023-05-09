import React, { useState } from 'react';
import { connect } from "react-redux";

const ChatFooter = ({ socket, userData }) => {
    const [message, setMessage] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && userData?.data?.firstName) {
            socket.emit('message', {
                text: message,
                name: userData?.data?.firstName,
                id: `${socket?.id}${Math.random()}`,
                socketID: socket?.id,
            });
        }
        setMessage('');
    };
    return (
        <div className="chat__footer">
            <form className="form_chat" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Write message"
                    className="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="sendBtn">SEND</button>
            </form>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        userData: state?.users,
    };
};

export default connect(
    mapStateToProps
)(ChatFooter);


