import React, { useEffect, useState, useContext } from 'react';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { AuthContext } from '../firebase/Auth';
import { Navigate } from 'react-router-dom';

const ChatPage = ({ socket }) => {
  const { currentUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('messageResponse', (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  if (!currentUser) {
    return <Navigate to='/' />;
  }

  return (
    <div className="chat">
      <div className="chat__main">
        <ChatBody messages={messages} />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;
