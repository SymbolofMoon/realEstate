import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import postReducer from "../slice/postSlice";
import singlepostReducer from "../slice/singlepostSlice";
import chatReducer from "../slice/chatSlice";
import singlechatReducer from "../slice/singlechatSlice";
import notificationReducer from '../slice/notificationSlice';
import favoriteCityReducer from "../slice/citySlice";
import { thunk } from 'redux-thunk';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    post: singlepostReducer,
    chats: chatReducer,
    chat: singlechatReducer,
    notification: notificationReducer,
    city: favoriteCityReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
