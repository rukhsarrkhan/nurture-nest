import React from 'react';
import { connect } from "react-redux";

const ChatBody = ({ messages, userData }) => {
    // ADD THIS TO STATE
    localStorage.setItem("messages", JSON.stringify(messages));

    return (
        <>
            <div className="message__container">
                {messages?.map((message) =>
                    message?.name === userData?.data?.firstName ? (
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

const mapStateToProps = state => {
    return {
        userData: state?.users,
    };
};

export default connect(
    mapStateToProps
)(ChatBody);

