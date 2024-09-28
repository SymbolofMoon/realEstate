import './chatpanel.scss';
import  { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat, receiveMessage, fetchChats,  selectReceiverByChatId,updateChatListMessage, seeninChatList, lastmsgseenByUser, resetChats } from '../../slice/chatSlice';
import { addMessage, fetchChatById, resetChat, receiveChatMessage } from '../../slice/singlechatSlice';
import ChatList from '../chatlist/ChatList';
import ChatBox from '../chatbox/ChatBox';
import { AuthContext } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { decreaseCount, increaseCount } from '../../slice/notificationSlice';

function ChatPanel () {
   const dispatch = useDispatch();
   const [isChatBoxVisible, setChatBoxVisible] = useState(false);
   const { currentUser } = useContext(AuthContext);
   
// //   const selectedChatId = useSelector(state => state.chat.selectedChatId);
   const { chats, selectedChatId, status, error } = useSelector(state => state.chats);
   const receiver = useSelector(state => selectReceiverByChatId(state, selectedChatId));
   let visibility = false;
//    const { socket } = useContext(SocketContext);
//   console.log(status, error);
const { socket } = useSocket(); 

useEffect(() => {
  return () => {
    dispatch(resetChats()); // If you have an action to reset the post state
  };
}, [dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchChats());
    }
  }, [dispatch, status]);


//   useEffect(() => {
//     socket.on('receiveMessage', (message) => {
//       dispatch(receiveMessage(message));
//     });

//     return () => {
//       socket.off('receiveMessage');
//     };
// //   }, [dispatch]);
useEffect(() => {
    // if (chatId) {
    //   socket.emit('joinChat', chatId);
    // }

    // console.log('Socket instance:', socket);
    // console.log("socket is",socket);
    if(socket){

    socket.on('receiveMessage', (message) => {
        const recvId = currentUser.id;
      if (message.chatId) {
   
        dispatch(updateChatListMessage({
          chatId:message.chatId,
          lastMessage: message.text,
          lastMessageTimestamp: message.createdAt,
          userId:message.userId
        }))
      };

      // dispatch(increaseCount());

      if (isChatBoxVisible && selectedChatId === message.chatId) {
        dispatch(receiveChatMessage({message, recvId:currentUser.id}));
        dispatch(seeninChatList({chatId:message.chatId, recvId:currentUser.id}))
        const data = {
            text:message.text,
            senderId:message.userId

        }
        console.log("this dispatch is called");
     
        const act=dispatch(lastmsgseenByUser({chatId:message.chatId,data }));
      }
    });
}

    return () => {

     socket && socket.off('receiveMessage');
    };
  }, [ socket, dispatch,  isChatBoxVisible, selectedChatId]);

  console.log(chats);

const handleChatClick = (chatId) => {
    dispatch(selectChat(chatId));
    dispatch(decreaseCount());
    visibility = true;
    setChatBoxVisible(visibility);
    const chat = chats.find((chat)=> chat.id===chatId);
    if(!chat.seenBy.includes(currentUser.id)){
        dispatch(seeninChatList({chatId, recvId:currentUser.id}));
        console.log("chat seenby",chat.seenBy);
        const data = {
            text:chat.lastMessage,
            senderId:chat.seenBy[0]

        }
        console.log(data);
        const act=dispatch(lastmsgseenByUser({chatId,data }));
        console.log(act);
    }

  };

  const handleCloseChatBox = () => {
    visibility = false;
    setChatBoxVisible(visibility);
    dispatch(selectChat(null)); // Optionally reset selected chat
  };

  return (
    <div className="chat">
        
            {status === 'loading' && <p>Loading chats...</p>}
            {status === 'failed' && <p>Error loading chats: {error}</p>}

                 <ChatList onSelectChat={handleChatClick}  chats={chats} />
                {/* <ChatBox chatId={selectedChatId} /> */}
                {isChatBoxVisible && (
                    <ChatBox chatId={selectedChatId} onClose={handleCloseChatBox} receiver={receiver}/>        
      )}
      
    </div>
  );
};

export default ChatPanel;
