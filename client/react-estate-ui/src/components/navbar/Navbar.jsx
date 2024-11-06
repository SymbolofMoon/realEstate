import { useContext, useEffect, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotficationCount, getNotificationCount } from "../../slice/notificationSlice";

function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const { currentUser} = useContext(AuthContext);
  const notificationCount = useSelector(getNotificationCount);

  // const fetch = useNotificationStore(state => state.fetch);
  // const number = useNotificationStore(state => state.number);

  useEffect(()=> {
    dispatch(fetchNotficationCount());
  }, [dispatch]);

  // fetch();

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>realEstate</span>
        </a>
        <a href="/">Home</a>
        <a href="/list">Post</a>
        <a href="/">Contact</a>
        <Link to="/agents">Agents</Link>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img
              src={currentUser.avatar || "/noavatar.jpg"}
              alt=""
            />
            <span>{currentUser.username}</span>
           
              
              <Link to={`/${currentUser.role}/profile`} className="profile">
              {notificationCount >0 && <div className="notification">{notificationCount}</div>}
                <span> {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Profile</span>
              </Link>
          </div>
        ) : (
          <>
          <Link to="/login" className="login">
            <a href="/login">Sign in</a>
            </Link>
            <a href="/register" className="register">
              Sign up
            </a>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <a href="/list">Post</a>
          <a href="/">Contact</a>
          <Link to="/agents">Agents</Link>
          <a href="/">Sign in</a>
          <a href="/">Sign up</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
