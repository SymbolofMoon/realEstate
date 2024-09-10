// import React from 'react';
import './chatlist.scss';
// import { useSelector } from 'react-redux';
import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat, receiveMessage, fetchChats } from '../../slice/chatSlice';
import { AuthContext } from "../../context/AuthContext";

function ChatList({onSelectChat, chats}) {
//   const chats = useSelector(state => state.chats.chats);
const dispatch = useDispatch();
const { currentUser } = useContext(AuthContext);
//   const selectedChatId = useSelector(state => state.chat.selectedChatId);
  

  return (
    <div className='messages'>
        <h1>Messages</h1>
        
        {chats.map(chat => (
            <div
            key={chat.id}
            className="chat-item"
            onClick={() => 
                onSelectChat(chat.id)
            //###  padhliya(chat?.id);
            }
            style={{
                backgroundColor: chat.seenBy.includes(currentUser.id) //|| chat?.id === c.id || seen.includes(c.id)
                ? "white"
                : "#fecd514e",
            }}
            >
            <img
            src={chat.receiver?.avatar || "/noavatar.jpg"}
            alt=""
            />
            <span>{chat.receiver?.username}</span>
            <p>{chat.lastMessage}</p>
            </div>
        ))}
        
    </div>
  );
};

export default ChatList;
