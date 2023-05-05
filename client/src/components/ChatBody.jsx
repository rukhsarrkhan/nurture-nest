import React, { useEffect, useState } from 'react';

const ChatBody = ({ messages }) => {
    localStorage.setItem("messages", JSON.stringify(messages));
    let items = JSON.parse(localStorage.getItem('messages'));

    return (
        <>
            <div className="message__container">
                {items?.map((message) =>
                    message?.name === localStorage.getItem('userName') ? (
                        <div className="message__chats" key={message?.id}>
                            <p className="sender__name">You</p>
                            <div className="message__sender">
                                <p>{message?.text}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="message__chats" key={message.id}>
                            <p className="reciever__name">{message.name}</p>
                            <div className="message__recipient">
                                <p>{message.text}</p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </>
    );
};

export default ChatBody;