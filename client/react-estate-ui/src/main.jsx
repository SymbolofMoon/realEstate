import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./index.scss"
import { Provider } from 'react-redux';
import { AuthContextProvider } from './context/AuthContext.jsx'
import { store } from '../src/store/store.js'; 
import NotificationProvider from './components/notification/Notification.jsx';
import { ToastContainer } from 'react-toastify';

import { SocketContextProvider } from './context/SocketContext.jsx';

// useSocket();

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
     <Provider store={store}>
    <AuthContextProvider>
      <SocketContextProvider> 
        <NotificationProvider />

      <ToastContainer 
        autoClose={5000}
        position="bottom-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"

      />
       
     
         <App />
      </SocketContextProvider>
    </AuthContextProvider>
    </Provider>
  //</React.StrictMode>, */},
)
