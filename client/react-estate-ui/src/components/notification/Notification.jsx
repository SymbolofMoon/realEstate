// NotificationProvider.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, readNotification } from '../../slice/notificationSlice';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useSocket } from "../../context/SocketContext";

const NotificationProvider = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notification.notifications);
    const { socket } = useSocket();
    

    useEffect(() => {
        // Fetch notifications when the component mounts
        dispatch(fetchNotifications());

        // socket?.on('sendNotification', (notification) => {
        //     // dispatch(addNotification(notification));
        //     toast(notification.content, {
        //         position: "top-right",
        //         autoClose: 5000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         progress: undefined,
        //         theme: "light",
        //     });
        //     console.log(notification);

        //     const notificationId = notification.id;
        //     dispatch(readNotification(notificationId)).unwrap();

        // });

        // // Clean up on component unmount
        // return () => {
        //     socket.off('sendNotification');
        // };
    }, [dispatch]);

    useEffect(() => {
        // Display each notification as a toast
        notifications?.forEach(async(notification) => {
           if(notification){
            toast(notification?.content_of_notification, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                // transition: Bounce,
            });
            
            const notificationId = notification.id;
            
            await dispatch(readNotification(notificationId)).unwrap();
        }
        });

        
    }, [notifications]);



    return (
        // <ToastContainer 
        // autoClose={5000}
        // position="bottom-right"
        // hideProgressBar={false}
        // newestOnTop={false}
        // closeOnClick
        // rtl={false}
        // pauseOnFocusLoss
        // draggable
        // pauseOnHover
        // theme="light"

    //   />
         null
    ); // This component doesn't render anything
};

export default NotificationProvider;
