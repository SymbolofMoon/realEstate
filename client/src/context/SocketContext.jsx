import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
// import { useContext } from "react";
import { io } from "socket.io-client";
import { getSocket, disconnectSocket } from "../lib/SocketManager";
import { useDispatch } from 'react-redux';
import { increaseCount } from '../slice/notificationSlice';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { readNotification } from "../slice/notificationSlice";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({ children })=>{

    const { currentUser } = useContext(AuthContext)
    const [socket, setSocket ] = useState(null);
    const dispatch = useDispatch();


    useEffect(() => {

        

        const newSocket = getSocket();
        setSocket(newSocket);

        if(currentUser){
            newSocket.emit("newUser", currentUser.id);
        }
        newSocket.on('receiveMessage', () => {
            dispatch(increaseCount()); // Update notification count
          });

          newSocket.on('sendNotification', (notification) => {
            // dispatch(addNotification(notification));
            toast(notification.content, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            console.log(notification);

            const notificationId = notification.id;
            dispatch(readNotification(notificationId)).unwrap();

        });

        // // Clean up on component unmount
        // return () => {
        //     socket.off('sendNotification');
        // };
        return () => {
            if(newSocket){
                console.log("disconnecting for", newSocket);
            newSocket.emit("disconnection", currentUser?.id);
            // newSocket.disconnect();
            }
        };
    }, [currentUser]);
    // useEffect(() => {
    //     const socketIo = getSocket(); // Replace with your server URL
    //     setSocket(socketIo);

    //     if(currentUser){
    //                 socketIo.emit("newUser", currentUser.id);
    //             }
    
    //     return () => {
    //       socketIo.disconnect();
    //     };
    //   }, []);
    // useEffect(()=> {
    //    if( currentUser && socket){
    //     socket.emit("newUser", currentUser.id)
    //    }
    // }, [currentUser, socket])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}