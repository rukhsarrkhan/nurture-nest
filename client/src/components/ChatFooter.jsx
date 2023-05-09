import React, { useState } from 'react';

const ChatFooter = ({ socket }) => {
    const [message, setMessage] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && localStorage.getItem('userName')) {
            socket.emit('message', {
                text: message,
                name: localStorage.getItem('userName'),
                id: `${socket?.id}${Math.random()}`,
                socketID: socket?.id,
            });
        }
        setMessage('');
    };
    return (
        <div className="chat__footer">
        <form className="form_chat" onSubmit={handleSendMessage}>
          <label htmlFor="message-input">Write message:</label>
          <input
            type="text"
            id="message-input"
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

export default ChatFooter;
