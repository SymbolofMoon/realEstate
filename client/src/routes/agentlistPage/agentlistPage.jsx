import { listData } from "../../lib/dummydata";
import "./agentlistPage.scss";
import FilterAgent from "../../components/filter/FilterAgent"
import CardProfile from "../../components/cardprofile/CardProfile"
import Chat from "../../components/chat/Chat";
import { useLoaderData, Await } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { Suspense } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import {useSocket } from "../../context/SocketContext";
import  apiRequest  from "../../lib/apiRequest";
import { useNotificationStore } from "../../lib/notificationStore";

function ListPage() {
  const data = useLoaderData();

  const { currentUser } = useContext(AuthContext);


  console.log("This are agents", data);

  // const [seen, setSeen] = useState([]);
  // const [chat, setChat] = useState(null);

  // const chats = data.chatResponse.data;
 
  
  // const { socket } = useSocket();
  // const messageEndRef = useRef();

  // const decrease = useNotificationStore(state => state.decrease);

  // useEffect(() => {
  //   messageEndRef.current?.scrollIntoView({behavior: "smooth"});
  // }, [chat]);

  ///HANDLEOPENCHAT FUNCTION STARTS
  // const handleOpenChat = async(receiverId)=>{
  //   console.log("curent user",currentUser.id);
  //   try {
  //     let res = await apiRequest.get("/chat/to/"+receiverId);

  //     if(res.data==""){
  //       console.log("yaha pe kesa ana hua");
  //         res = await apiRequest.post("/chat",  {
  //         receiverId:receiverId
  //       })
  //     }
  //     // if(!res.data.seenBy.includes(currentUser.id)){
  //     //   decrease();
  //     // }
      
      
  //     setChat(res.data);
  //     console.log(chat);
  //     // if(!seen.includes(id)){
  //     //   padhliya(id);
  //     // }
  //     // console.log("chatwal", chat.id);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  ///HANDLEOPENCHAT FUNCTION ENDS

  ///HANDLEOPENCHAT2 FUNCTION STARTS
  // const handleOpenChat2 = async(id, receiver)=>{
  //   try {
  //     const res = await apiRequest("/chat/" + id);
  //     if(!res.data.seenBy.includes(currentUser.id)){
  //       decrease();
  //     }
  //     console.log("curent user",currentUser.id);
  //     console.log("res wala",res.data);
  //     setChat({...res.data, receiver});
  //     // if(!seen.includes(id)){
  //     //   padhliya(id);
  //     // }
  //     // console.log("chatwal", chat.id);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
    
  ///HANDLEOPENCHAT2 FUNCTION ENDS
  
  // HANDLESUBMIT FUNCTION START
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   const text = formData.get("text");

  //   if(!text) return;


  //   try {
  //     const res = await apiRequest.post("/message/"+chat.id, { text });
  //     setChat((prev) => ({...prev, messages: [...prev.messages, res.data]}));
  //     e.target.reset();
  //     socket.emit("sendMessage" , {
  //       receiverId: chat.receiver.id,
  //       data: res.data,
  //     })

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  /// HANDLESUBMIT FUNCTION END

  // const padhliya=(id) =>{
  //   setSeen([...seen, id]);
  // }

  // useEffect(()=> {
  //   const read = async() => {
  //         try {
  //           await apiRequest.put("/chat/read/"+chat.id);
  //           console.log()
  //         } catch (error) {
  //           console.log(error)
  //         }
  //       };

  //       if(chat && socket){
  //         socket.on("getMessage", (data)=>{
  //           if(chat.id === data.chatId){
  //             setChat((prev) => ({...prev, messages: [...prev.messages, data]}));
  //             console.log("this function is called");
  //             read();
  //           }
  //         })
  //       }

  //       return () => {
  //         socket.off("getMessage");
  //       }
  //     }, [socket, chat]);


  return (
   <div className="agentlistPage">
    <div className="listContainer">
      <div className="wrapper">
        <FilterAgent/>
        <Suspense fallback={<p>Loading...</p>}>
          <Await 
            resolve={data.agentResponse}
            errorElement={<p>Error Loading Agents!!!</p>}
          >
            {(agentResponse) => agentResponse.data.map(agent => (
               
        <CardProfile key={agent.id} item={agent} handleOpenChat={()=>handleOpenChat(agent.id)} />
            //   <p>ID: {agent.id}</p> 
            ))}
          </Await>
        </Suspense>
      </div>
    </div>

             {/* {-----------------------------------------CHAT CONTAINER SECTION---------------------------------------} */}
    {/* <div className="chatContainer">
        <div className="wrapper">
            <Suspense fallback={<p>Loading...</p>}>
            <Await
                resolve={data.chatResponse}
                errorElement={<p>Error Loading Posts!!!</p>}
            >
                {/* {(chatResponse) => <Chat chats = {chatResponse.data}/>} 

    <div className="chat"> */}
          {/* {-----------------------------------------CHATS---------------------------------------} */}
      {/* <div className="messages">
        <h1>Messages</h1>    
          { chats?.map(c=>(
          <div 
          className="message" 
          key={c.id}
          style={{
            backgroundColor: c.seenBy.includes(currentUser.id) || chat?.id === c.id || seen.includes(c.id)
            ? "white"
            : "#fecd514e",
          }}
          onClick={() => {
            
            console.log("openchat wala chatid",c.id);
            handleOpenChat2(c.id, c.receiver);
            // padhliya(chat.id);
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
    </div> */}

    {/* {--------------------------------------------------------------------------------------------------------------} */}

      {/* {------------------------------------CHATBOX-----------------------------------------} */}
              {/* {chat && (
                <div className="chatBox">
                  <div className="top">
                    <div className="user">
                      <img
                        src={ chat.receiver.avatar || "/noavatar.jpg"}
                        alt=""
                      />
                       {chat.receiver.username}
                    </div>
                    <span className="close" onClick={()=>
                      {
                        setChat(null);
                        // padhliya(chat.id);
                      }
                      }>X</span>
                  </div>
                  <div className="center">
                    {chat.messages?.map((message) => (
                      <div className="chatMessage" 
                      style={{
                        alignSelf: message.userId === currentUser.id ? "flex-end": "flex-start",
                        textAlign: message.userId === currentUser.id ? "right" : "left",
                      }}
                      key={message.id}>
                          <p>{message.text}</p>
                          <span>{format(message.createdAt)}</span>

                      </div>
                    ))}
                    {/* <div ref={messageEndRef}></div> 
                  </div>
                   <form  className="bottom">
                    <textarea name="text"></textarea>
                    
                    <button>Send</button>
                  </form>
                </div>
              )} */}
        {/* {-----------------------------------------------------------------------------} */}

        {/* </div>
            </Await>
            </Suspense>
        </div>
    </div> */}

                 {/* {----------------------------------------------------------------------------------------------} */}
  </div>
  );
}

export default ListPage;
