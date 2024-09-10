import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from '../lib/apiRequest';
// import { sub } from 'date-fns';
import axios from "axios";



const initialState = {
    chat: {},
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

// export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (queryParams) => {
//     console.log("hello");
//     // const query = request.url.split("?")[1]
//     const query = new URLSearchParams(queryParams).toString();
//     const response = await apiRequest.get(`/post?${query}`);
//     console.log(response);
//     return response.data
// })

// export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
//     const response = await apiRequest.post('/post', initialPost)
//     return response.data
// })

export const updatePost = createAsyncThunk('post/updatePost', async ({postId, postData}) => {
   
    try {
        const response = await apiRequest.put(`/post/${postId}`, postData)
        return response.data
    } catch (err) {
        //return err.message;
        return initialPost; // only for testing Redux!
    }
})

export const fetchChatById = createAsyncThunk('chat/fetchChatById', async (chatId) => {
    try {
        const response = await apiRequest.get(`/chat/${chatId}`);
        console.log("response", response);
        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const deletePost = createAsyncThunk('post/deletePost', async (postId) => {
    try {
        const response = await apiRequest.delete(`/post/${postId}`)
        return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
        return err.message;
    }
})

export const addMessage = createAsyncThunk(
    'chat/addMessage',
    async ({ chatId, text }) => {
        try {
            const response = await apiRequest.post(`/message/${chatId}`, { text });
            console.log("response of chat", response );

            return response.data;
        } catch (error) {
            console.log(error);
        }
     
    }
  );
  

const singlechatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        
        resetChat(state) {
            state.chat = [];
            state.status = 'idle';
          },
        receiveChatMessage(state, action) {
            // const { text } = action.payload;
            // if (!state.messages[chatId]) {
            //   state.messages[chatId] = [];
            // }
            state.chat.lastMessage = action.payload.message.text;
            state.chat.createdAt = action.payload.message.createdAt;
            // state.chat.seenBy.push = action.payload.text;
            state.chat.messages.push(action.payload.message);
            // console.log(action.payload);
            state.chat.seenBy.push(action.payload.recvId)
          }
        // messageAdded: {
        //     reducer(state,action){
        //         state.chat.push(action.payload);
        //     }
        // }  
      
    },
    extraReducers(builder) {
        builder
            .addCase(fetchChatById.pending, (state) => {
                state.status = 'loading';
              })
            .addCase(fetchChatById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.chat = action.payload;
              })
            .addCase(fetchChatById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
              })
            // .addCase(updatePost.pending, (state) => {
            //     state.status = 'loading';
            //   })
            .addCase(addMessage.fulfilled, (state, action) => {
                console.log(action.payload);
                state.chat.lastMessage = action.payload.text;
                state.chat.messages.push(action.payload);
                state.chat.createdAt = action.payload.createdAt;
                //state.chat.seenBy
            });
            // .addCase(updatePost.rejected, (state, action) => {
            //     state.status = 'failed';
            //     state.error = action.error.message;
            //   })
            // .addCase(savePost.fulfilled, (state, action) => {
            //     if (state.post.id === action.payload.postId) {
            //       state.post.isSaved = action.payload.saved;
            //     }
            //   });
    }
})

// export const selectPost = (state) => state.post.post;
// export const getPostStatus = (state) => state.post.status;
// export const getPostError = (state) => state.post.error;



// export const selectPostById = (state, postId) =>
//     state.posts.posts.find(post => post.id === postId);

export const { resetChat, receiveChatMessage } = singlechatSlice.actions

export default singlechatSlice.reducer