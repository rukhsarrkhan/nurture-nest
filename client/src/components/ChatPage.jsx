import React, { useEffect, useState } from 'react';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
  }, [messages]);
  console.log("messages", messages);

  useEffect(() => {
    socket.on('messageResponse', (data) => setMessages([...messages, data]));
  }, [socket, messages]);

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