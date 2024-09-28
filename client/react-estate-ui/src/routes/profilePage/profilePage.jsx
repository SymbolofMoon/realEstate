import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";

import apiRequest from "../../lib/apiRequest";
import { Await, Link, Navigate, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext,useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchSavedPosts } from "../../slice/authSlice";
import  ChatPanel  from "../../components/chatpanel/ChatPanel";
import { useDispatch, useSelector } from 'react-redux';

function ProfilePage({role}) {

  // const data = useLoaderData();
  const dispatch = useDispatch();
  const { savedPosts, status }= useSelector(state=>state.auth);
  const {updateUser, currentUser} = useContext(AuthContext);
  useEffect(() => {
    console.log(status);
    if(status=="idle"){
      const act = dispatch(fetchSavedPosts());
      console.log(act);
    }
  }, [dispatch, status]);
console.log(savedPosts);

  const navigate = useNavigate(); 

  if(currentUser.role!=role) {
    navigate("/login");
  }

  const handleLogout = async() =>{
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");


    } catch (error) {
      console.log(error)
    }
  }

  if(currentUser.role!=role) {
    handleLogout();
    navigate("/login");
  }

  return (
    currentUser && (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src={currentUser.avatar || "/noavatar.jpg" }
                alt=""
              />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <span>
              Role: <b>{currentUser.role}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>Saved List</h1>
            { currentUser.role==="agent" && (
              <Link to="/add">
             <button>Create New Post</button>
            </Link>
            )}
            
          </div>
          {/* <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error Loading Posts!!!</p>}
          >*/}
            <List posts = {savedPosts}/>
          {/* </Await>
        </Suspense>  */}
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
        {/* <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data.chatResponse}
            errorElement={<p>Error Loading Posts!!!</p>}
          >
            {(chatResponse) => <Chat chats = {chatResponse.data}/>}
          </Await>
        </Suspense> */}
          <ChatPanel />

        </div>
      </div>
    </div>
  )
);
}

export default ProfilePage;
