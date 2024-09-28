import { Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import "./cardprofile.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useSelector, useDispatch } from 'react-redux';
import { addSubscriber } from "../../slice/authSlice";

function CardProfile({ item, handleOpenChat }) {

  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [subscribed, setSubscribed] = useState(item.publisher && item.publisher.length > 0);
  
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.auth.user);
  const publisherId = item.id;
  

  const handleaddChat = async() =>{
    try {
      const res = await apiRequest.post("/chat", {
        receiverId:item.id
      });
      
    } catch (error) {
      console.log("not add chat");
    }

    console.log("chat added");
  }

  const handleSubscription = async() => {
    let prev = !subscribed;
    setSubscribed(prev);
    if(!currentUser){
      navigate("/login");
      return;
     }

    try {
      // await apiRequest.post("/user/save", {postId: post.id});
      const cond = await dispatch(addSubscriber(publisherId)).unwrap();

      console.log(cond);
    } catch (error) {
      console.log(error);
      // setSaved((prev) => !prev);
    }
  }
  
  return (
    <div className="cardprofile">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.avatar || "/noavatar.jpg"} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.username}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>Tokyo</span>
        </p>
        <p className="price">Contact No: {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/email.png" alt="" />
              <span>{item.email}</span>
            </div>
            <div className="feature">
            <button 
            onClick={handleSubscription}
            style={{backgroundColor: (subscribed) ? "#fece51" : "white"}}
            >
              { (subscribed) ? "UnSubscribe" : "Subscribe"}
            </button>
              </div>
            {item.id!==currentUser.id && (
              <div className="feature">
                <button onClick={()=>handleOpenChat(item.id)}>Chat</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardProfile;
