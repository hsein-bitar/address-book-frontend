import React from "react";
import "./message.css";


const Message = ({ message = "", theme = 0 }) => {
    return (
        message ?
            <div id="message_key" className="message-wrapper">
                <div className={`message ${theme === 0 ? 'good' : 'bad'}`}>
                    <span>
                        {message}
                    </span>
                </div>
            </div > : <></>)
}

export default Message;