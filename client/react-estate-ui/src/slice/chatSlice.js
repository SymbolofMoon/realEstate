import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRequest from '../lib/apiRequest';

const initialState = {
  chats: [], // List of all chats
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  selectedChatId: null, // ID of the selected chat
  messages: {} // Messages for each chat
};

export const fetchChats = createAsyncThunk('chats/fetchChats', async () => {
    // const query = request.url.split("?")[1]
    // const query = new URLSearchParams(queryParams).toString();
    // console.log(query);
    try {
        const response = await apiRequest.get('/chat');
    console.log(response);
    return response.data
        
    } catch (error) {
        console.log(error)
    }
    
})
// export const fetchChats

export const lastmsgseenByUser = createAsyncThunk('chats/lastmsgseenByUser', async({chatId, data})=>{
    try {
        const response = await apiRequest.put(`/message/${chatId}`, {data});
        return response.data;
    } catch (error) {
        console.log(error);
    }
})


const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addChat(state, action) {
      state.chats.push(action.payload);
    },
    selectChat(state, action) {
      state.selectedChatId = action.payload;
    },
    receiveMessage(state, action) {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
    updateChatListMessage(state,action) {
        const { chatId, lastMessage, lastMessageTimestamp, userId } = action.payload;
        // console.log(action.payload);
        const chat = state.chats.find(chat => chat.id === chatId);
        if (chat) {
            chat.lastMessage = lastMessage;
            chat.createdAt = lastMessageTimestamp;
            chat.seenBy = [userId]
        }
        
    },
    seeninChatList(state, action){
        const { chatId, recvId } = action.payload;
        const chat = state.chats.find(chat => chat.id === chatId);
        if (chat) {
            console.log(chat);
            chat.seenBy.push(recvId);
        }
    },
    resetChats(state) {
      state.chats = [];
      state.status = 'idle';
      state.error= null,
      state.selectedChatId= null, // ID of the selected chat
      state.messages= {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(lastmsgseenByUser.fulfilled, (state, action) => {
        //just an api call
        // const { chatId } = action.payload;
        // const chat = state.chats.find(chat => chat.id === chatId);
        // if (chat) {
        //     console.log(chat);
        //     chat.seenBy.push(recvId);
        // }
        console.log(action.payload);
      });
  }
});

export const selectChatById = (state, chatId) => {
    return state.chats.chats.find(chat => chat.id === chatId);
  };

export const selectReceiverByChatId = (state, chatId) => {
    const chat = selectChatById(state, chatId);
    return chat ? chat.receiver : null;
  };

export const { addChat, selectChat, receiveMessage, updateChatListMessage, seeninChatList, resetChats } = chatSlice.actions;

export default chatSlice.reducer;
