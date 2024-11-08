import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from '../lib/apiRequest';




const initialState = {
    favoriteCities: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
    error: null
}

// export const fetchNotficationCount = createAsyncThunk('notification/fetchNotificationCount', async (_, { getState }) => {

//     const state = getState();
//     const user = state.auth; // Access user from state

//     if (!user.user) {
//        return;
//     }
//     const response = await apiRequest.get('/user/notification');
//     // console.log(response);
//     return response.data
// })

// export const addNotification = createAsyncThunk('notification/addNotification', async({content})=>{
//     try {
//         const response =  await apiRequest.post('/user/add/notification', {content});
//         console.log("from addnotification",response);
//         return response.data;
//     } catch (error) {
//         console.log(error)
//     }
// })

// export const fetchNotifications = createAsyncThunk('notification/fetchNotifications', async (_, { getState }) => {
//     // const response = await apiRequest.get('/user/notification');
//     // console.log(response);
//     // return response.data

//     const state = getState();
//     const user = state.auth; // Access user from state

//     if (!user.user) {
//         throw new Error('User is not logged in');
//     }

//     try {
//         const response =  await apiRequest.get('/user/fetch/notification');
//         console.log("fetch notification", response.data);
//         return response.data;


//     } catch (error) {
//         console.log(error)
//     }
// })

// export const readNotification = createAsyncThunk('notification/readNotification', async (notificationId) => {
//     // const response = await apiRequest.get('/user/notification');
//     // console.log(response);
//     // return response.data

//     try {
//         const response =  await apiRequest.put(`/user/read/notification/${notificationId}`);
//         console.log("read notification", response.data);

//         return response.data;


//     } catch (error) {
//         console.log(error)
//     }
// })

export const fetchfavoriteCities =createAsyncThunk('city/fetchfavoriteCities', async () => {
    // const query = request.url.split("?")[1]
    const response = await apiRequest.get('/user/fetch/favorite/cities');
    console.log(response);
    return response.data
})

export const alterfavoriteCity = createAsyncThunk('city/alterfavoriteCity', async ({citynumber, cityname}) => {
    const response = await apiRequest.post('/user/favorite/city', {cityname, citynumber});
    return response.data
})

const citySlice = createSlice({
    name: 'city',
    initialState,
    reducers: { 
        resetfavoriteCities(state){
            state.favoriteCities = []
        },
        // decreaseCount(state,action){
        //     state.unreadCount = Math.max(state.unreadCount-1,0);
        // },
        // increaseCount(state, action){
        //     state.unreadCount = state.unreadCount+1;
        // },
        // clearNotifications: (state) => {
        //     state.notifications = [];
        // }, 
    },
    extraReducers(builder) {
        builder
            // .addCase(fetchNotficationCount.fulfilled, (state, action) => {
            //     state.unreadCount = action.payload;
            // })
            // .addCase(fetchNotifications.fulfilled, (state, action)=>{
            //     console.log(action.payload, "fetch notifications from something");
            //     state.notifications =  action.payload;
            // })
            // // .addCase(addNotification.fulfilled, (state, action)=>{

            // //     state.notifications.push(action.payload);
            // // })
            // .addCase(readNotification.fulfilled, (state,action)=>{
            //     console.log(action.payload);
            //     state.notifications.filter((notification =>(notification.id)!==action.payload.id ));
            // })
            .addCase(fetchfavoriteCities.pending, (state) => {
                state.status = 'loading';
              })
            .addCase(fetchfavoriteCities.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.favoriteCities = action.payload;
            })
            .addCase(fetchfavoriteCities.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
              })
            .addCase(alterfavoriteCity.fulfilled, (state, action)=>{
                if(action.payload.status=="UnLike"){
                  const r =  state.favoriteCities.findIndex(city=> city.id === action.payload.id);
                  if(r!=-1){
                    state.favoriteCities.splice(r,1);
                  }                  
                }else{
                    state.favoriteCities.push(action.payload);
                }
            })
            
    }
})


// export const getNotificationCount = (state) =>
//     state.notification.unreadCount;

export const { resetfavoriteCities } = citySlice.actions

export default citySlice.reducer