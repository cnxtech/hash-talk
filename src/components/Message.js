
import React from 'react';
// functional component are less prone to errors 
function Message(props) {  

    return <div className="message">
               <div className="message-username">{props.username}</div>
               <div className="message-text">{props.text}</div>           
            </div>
        ;
    
}

export default Message;