// function ChatBox({chat, setChat, padhliya}){


//     return (
//         <div className="chatBox">
//         <div className="top">
//           <div className="user">
//             <img
//               src={chat.receiver.avatar || "/noavatar.jpg"}
//               alt=""
//             />
//             {chat.receiver?.username}
//           </div>
//           <span className="close" onClick={()=>
//             {
//               setChat(null);
//               padhliya(chat.id);
//             }
//             }>X</span>
//         </div>
//         <div className="center">
//           {chat.messages.map((message) => (
//             <div className="chatMessage" 
//             style={{
//               alignSelf: message.userId === currentUser.id ? "flex-end": "flex-start",
//               textAlign: message.userId === currentUser.id ? "right" : "left",
//             }}
//             key={message.id}>
//                 <p>{message.text}</p>
//                 <span>{format(message.createdAt)}</span>

//             </div>
//           ))}
//           <div ref={messageEndRef}></div>
//         </div>
//         <form onSubmit={handleSubmit} className="bottom">
//           <textarea name="text"></textarea>
         
//           <button>Send</button>
//         </form>
//       </div>
//     )
// }

// export default ChatBox;



import React, { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import socket from './socket';
// import { receiveMessage } from './actions/chatActions';
import { addMessage, fetchChatById, resetChat, receiveChatMessage } from '../../slice/singlechatSlice';
import { AuthContext } from "../../context/AuthContext";
import { format } from "timeago.js";
import { useSocket } from "../../context/SocketContext";
import { updateChatListMessage } from '../../slice/chatSlice';


const ChatBox = ({ chatId, onClose, receiver }) => {
  const dispatch = useDispatch();
  const {chat, status, error} = useSelector(state=>state.chat);
  const {chats} = useSelector(state=>state.chats);
  const { currentUser } = useContext(AuthContext);
  const messageEndRef = useRef();
  const { socket } = useSocket();
  // const messages = useSelector(state => state.chat.messages[chatId] || []);
  // const [messageInput, setMessageInput] = useState('');

  // useEffect(() => {
  //   if (chatId) {
  //     socket.emit('joinChat', chatId);
  //   }
  // }, [chatId]);

  useEffect(() => {
    return () => {
      dispatch(resetChat()); // If you have an action to reset the post state
    };
  }, [dispatch]);

  useEffect(()=>{
    const fetchChat =  async() =>{
      if(status==='idle'){
        try {
          // Dispatch the async thunk and wait for it to resolve
          const action = await dispatch(fetchChatById(chatId)).unwrap();
          console.log(action);
       
          // Access the result
        } catch (error) {
          console.error('Error dispatching fetchPostById:', error);
        }
      }
    };

    fetchChat();
  }, [dispatch, chatId, status]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [chat]);

  // useEffect(() => {
  //   if (chatId) {
  //     socket.emit('joinChat', chatId);
  //   }

  //   socket.on('receiveMessage', (message) => {
  //     console.log(message, "from chatbox");
  //     if (message.chatId === chatId) {
  //       dispatch(receiveChatMessage(message));
  //       dispatch(updateChatListMessage({
  //         chatId,
  //         lastMessage: message.text,
  //         lastMessageTimestamp: message.createdAt
  //       }))
  //     }
  //   });

  //   return () => {
  //     socket.off('receiveMessage');
  //   };
  // }, [chatId, socket, dispatch]);
  console.log(chat);

  const handleSubmit = async(e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if(!text) return;

    try {
      const senderId = currentUser.id;

      const action = await dispatch(addMessage({chatId, text})).unwrap();
      dispatch(updateChatListMessage({
        chatId,
        lastMessage: text,
        lastMessageTimestamp: action.createdAt,
        userId: senderId
      }));
  

      e.target.reset();

      socket.emit("sendMessage" , {
        receiverId: receiver.id,
        data: action,
      });
      
    } catch (error) {
      console.log(error);
    }
    // if (messageInput.trim()) {
    //   const message = { chatId, text: messageInput, timestamp: new Date().toISOString() };
    //   socket.emit('sendMessage', message);
    //   setMessageInput('');
    // }
  };

  return (
    <div className="chatBox">
        <div className="top">
          <div className="user">
            <img
              src={receiver?.avatar || "/noavatar.jpg"}
              alt=""
            />
            {receiver.username}
          </div>
          <span className="close" onClick={onClose}>X</span>
        </div>
      <div className="center">
          {status==="succeeded" && chat.messages.map((message) => (
              <div className="chatMessage" 
              style={{
                alignSelf: message.userId === currentUser.id ? "flex-end": "flex-start",
                textAlign: message.userId === currentUser.id ? "right" : "left",
              }}
              key={message.id}>
                <img
                src={currentUser.avatar || "/noavatar.jpg"}
                alt=""
              />
              <p style={{fontSize: 12}}>{message.userId === currentUser.id ? currentUser.username : receiver.username}</p>
                <div className="chatmsg">
                  <p>{message.text}</p>
                  <span>{format(message.createdAt)}</span>
                </div>
              </div>
            ))}
          <div ref={messageEndRef}></div>
        </div>
        <form onSubmit={handleSubmit} className="bottom">         
          <textarea name="text"></textarea>
         
          <button>Send</button>
        </form>

      </div>
  );
};

export default ChatBox;
