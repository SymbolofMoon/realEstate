import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from '../lib/apiRequest';




const initialState = {
    unreadCount:0,
    notifications: []
}

export const fetchNotficationCount = createAsyncThunk('notification/fetchNotificationCount', async (_, { getState }) => {

    const state = getState();
    const user = state.auth; // Access user from state

    if (!user.user) {
       return;
    }
    const response = await apiRequest.get('/user/notification');
    // console.log(response);
    return response.data
})

export const addNotification = createAsyncThunk('notification/addNotification', async({content})=>{
    try {
        const response =  await apiRequest.post('/user/add/notification', {content});
        console.log("from addnotification",response);
        return response.data;
    } catch (error) {
        console.log(error)
    }
})

export const fetchNotifications = createAsyncThunk('notification/fetchNotifications', async (_, { getState }) => {
    // const response = await apiRequest.get('/user/notification');
    // console.log(response);
    // return response.data

    const state = getState();
    const user = state.auth; // Access user from state

    if (!user.user) {
        throw new Error('User is not logged in');
    }

    try {
        const response =  await apiRequest.get('/user/fetch/notification');
        console.log("fetch notification", response.data);
        return response.data;


    } catch (error) {
        console.log(error)
    }
})

export const readNotification = createAsyncThunk('notification/readNotification', async (notificationId) => {
    // const response = await apiRequest.get('/user/notification');
    // console.log(response);
    // return response.data

    try {
        const response =  await apiRequest.put(`/user/read/notification/${notificationId}`);
        console.log("read notification", response.data);

        return response.data;


    } catch (error) {
        console.log(error)
    }
})



const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: { 
        resetCount(state,action){
            state.unreadCount = 0
        },
        decreaseCount(state,action){
            state.unreadCount = Math.max(state.unreadCount-1,0);
        },
        increaseCount(state, action){
            state.unreadCount = state.unreadCount+1;
        },
        clearNotifications: (state) => {
            state.notifications = [];
        }, 
    },
    extraReducers(builder) {
        builder
            .addCase(fetchNotficationCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })
            .addCase(fetchNotifications.fulfilled, (state, action)=>{
                console.log(action.payload, "fetch notifications from something");
                state.notifications =  action.payload;
            })
            // .addCase(addNotification.fulfilled, (state, action)=>{

            //     state.notifications.push(action.payload);
            // })
            .addCase(readNotification.fulfilled, (state,action)=>{
                console.log(action.payload);
                state.notifications.filter((notification =>(notification.id)!==action.payload.id ));
            })
    }
})


export const getNotificationCount = (state) =>
    state.notification.unreadCount;

export const { resetCount, decreaseCount, increaseCount, clearNotifications } = notificationSlice.actions

export default notificationSlice.reducer