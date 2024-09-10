import { useContext, useState, useEffect, useRef } from "react";
import "./chat.scss";
import { format } from "timeago.js"
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useSocket } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({chats}) {

  const [seen, setSeen] = useState([]);
  const [chat, setChat] = useState(null);
  const [chatbox, setChatBox] =  useState(false);
  // const [msg, setMsg] = useState('');
  const [chatlist, setChatList] =  useState(chats);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useSocket();
  const messageEndRef = useRef();
  const decrease = useNotificationStore(state => state.decrease);
  console.log("Normal chat", chats);

  // console.log(chatlist);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({behavior: "smooth"});

    // if(chat){
    //   setMsg(chat.message);
    //   // console.log(chat);
    // }
  }, [chat]);

  useEffect(() => {
    // Listen for incoming messages
    // socket.on('receiveMessage', (latestDatafromReceiver) => {
    //     console.log("this is for receive message", latestDatafromReceiver);
    //     const latestrecMsg = {
    //       id: latestDatafromReceiver.chatId,
    //       lastmessage: latestDatafromReceiver.text,
    //       createdAt: latestDatafromReceiver.createdAt,
    //       seenBy: [latestDatafromReceiver.userId, currentUser.id]
    //     }
    //     console.log(latestrecMsg);
    //     const latestreccMsg = {
    //       id: latestDatafromReceiver.chatId,
    //       text: latestDatafromReceiver.text,
    //       createdAt: latestDatafromReceiver.createdAt
    //     }
    //     updateChatList(latestrecMsg);
    //     setChat((recv) => ({...recv, messages: [...recv.messages, latestreccMsg]}));
    //     console.log("this is in receiver ", chatlist);
    // });
    const handleReceiveMessage = async (latestDatafromReceiver) => {
      console.log("Received message:", latestDatafromReceiver);
  
      const latestrecMsg = {
        id: latestDatafromReceiver.chatId,
        lastmessage: latestDatafromReceiver.text,
        createdAt: latestDatafromReceiver.createdAt,
        seenBy:[latestDatafromReceiver.userId]
      };
  
      const latestreccMsg = {
        id: latestDatafromReceiver.chatId,
        text: latestDatafromReceiver.text,
        createdAt: latestDatafromReceiver.createdAt
      };
      console.log(chatbox);
      console.log("latestDatafromReceiver is ",latestDatafromReceiver);

      // if(chatbox){

      // }
      
      const res = await apiRequest.put('/message/'+latestDatafromReceiver.id, {
        latestDatafromReceiver
      });
  
      updateChatList(latestrecMsg);
      setChat((recv) => ({
        ...recv,
        messages: [...recv.messages, latestreccMsg]
      }));
    };
  
    socket.on('receiveMessage', handleReceiveMessage);

   

    

    return () => {
        socket.off('receiveMessage'); // Clean up on unmount
    };
}, [socket, currentUser.id]);

useEffect(()=>{
  if(chat){
    // setChatList((prevChats) =>
    //   prevChats.map((c) =>
    //       c.id === chat.id
    //           ? { ...c, seenBy:[...c.seenBy, currentUser.id]}
    //           : chat
    //   ))
    console.log(chat);
    padhliya(chat.id);
  }
}, [chatlist])


  const handleOpenChat = async(id, receiver)=>{
    try {
      const res = await apiRequest("/chat/" + id);
      if(!res.data.seenBy.includes(currentUser.id)){
        decrease();
      }
      // console.log("curent user",currentUser.id);
      // console.log("res wala",res.data);
      setChat({...res.data, receiver});
      setChatBox(true);
      if(!seen.includes(id)){
        padhliya(id);
      }
      // console.log("chatwal", chat.id);
    } catch (error) {
      console.log(error);
    }
  }

  console.log(chatbox);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");
    const seenBySender = [currentUser.id];

    if(!text) return;


    try {
      const res = await apiRequest.post("/message/"+chat.id, { text });
      setChat((prev) => ({...prev, messages: [...prev.messages, res.data]}));
      e.target.reset();
      socket.emit("sendMessage" , {
        receiverId: chat.receiver.id,
        data: res.data,
      });

      const latestChatData = {
        id: chat.id,
        lastmessage: text,
        createdAt: res.data.createdAt,
        seenBy:seenBySender
      }  

      updateChatList(latestChatData);
      console.log(chatlist);

    } catch (error) {
      console.log(error);
    }
  }

  const padhliya=(id) =>{
    setSeen([...seen, id]);
  }

  const updateChatList = (latestChatData) => {
    
    console.log("chatlist1 called", chatlist);
    setChatList((prevChats) =>
        prevChats.map((chat) =>
            chat.id === latestChatData.id
                ? { ...chat, lastMessage: latestChatData.lastmessage, createdAt: latestChatData.createdAt, 
                  seenBy:[...new Set([...chat.seenBy, ...latestChatData.seenBy])] }
                : chat
        )
        
    );

    console.log("chatlist2 called", chatlist);
    console.log("normal chats", chats);
};

// useEffect(() => {
//   // 
//   setChatList(chatlist);
//   console.log("this is called");
  
// }, [chatlist]);

console.log("chatlist", chatlist);



  useEffect(()=> {
    const read = async() => {
          try {
            await apiRequest.put("/chat/read/"+chat.id);
            console.log()
          } catch (error) {
            console.log(error)
          }
        };

        if(chat && socket){
          socket.on("getMessage", (data)=>{
            if(chat.id === data.chatId){
              setChat((prev) => ({...prev, messages: [...prev.messages, data]}));
              console.log("this function is called");
              read();
            }
          })
        }

        return () => {
          socket.off("getMessage");
        }
      }, [socket, chat]);


  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        
      {chatlist?.map(c=>(

      

          <div 
          className="message" 
          key={c.id}
          style={{
            backgroundColor: c.seenBy.includes(currentUser.id) || chat?.id === c.id || seen.includes(c.id)
            ? "white"
            : "#fecd514e",
          }}
          onClick={() => {
            console.log("seenby",c.seenBy);
            console.log(seen);
            console.log("openchat wala chatid",c.id);
            handleOpenChat(c?.id, c?.receiver);
            padhliya(chat?.id);
          }
            
          }
          
          >
          <img
            src={c.receiver?.avatar || "/noavatar.jpg"}
            alt=""
          />
          <span>{c.receiver?.username}</span>
          <p>{c.lastMessage}</p>
        </div>
       ))}
      </div>
      {chat && (
       
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={chat.receiver.avatar || "/noavatar.jpg"}
                alt=""
              />
              {chat.receiver?.username}
            </div>
            <span className="close" onClick={()=>
              {
                setChat(null);
                console.log(chat.id);
                console.log(chat.seenBy);
                padhliya(chat.id);
                setChatBox(false);
              }
              }>X</span>
          </div>
          <div className="center">
            {chat.messages.map((message) => (
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
              <p style={{fontSize: 12}}>{message.userId === currentUser.id ? currentUser.username : chat.receiver.username}</p>
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
      )}
    </div>
  );
}

export default Chat;
