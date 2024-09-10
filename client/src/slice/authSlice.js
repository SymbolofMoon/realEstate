import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRequest from '../lib/apiRequest';

// Initial state
const initialState = {
  user: null,
  savedPosts:[],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await apiRequest.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      
      console.log("here is ", error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



// Async thunk for registration
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await apiRequest.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.log("here is ", error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchSavedPosts = createAsyncThunk(
  'auth/savedPosts',
  async(thunkAPI) => {
    try {
      const response = await apiRequest.get('/user/profilePosts');
      return response.data;
    } catch (error) {
      console.log("here is ", error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

//Async Thunk for Subscribing/Unsubscribing the Agent
export const addSubscriber = createAsyncThunk(
  'auth/publishersubscribe',
  async ( publisherId ) => {
    console.log(publisherId);
    await apiRequest.post('/user/subscribe', { publisherId });
    return { publisherId };
  }
);

//Update Auth
export const updateProfile = createAsyncThunk('auth/updateProfile', async ({postId, postData}) => {
   
  try {
      const response = await apiRequest.put(`/post/${postId}`, postData)
      return response.data
  } catch (err) {
      //return err.message;
      return initialPost; // only for testing Redux!
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        console.log(state.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addSubscriber.fulfilled, (state, action) => {
        console.log(action.payload);
        // state.auth.user.subscribedto = action.payload.publisherId;
      })
      .addCase(fetchSavedPosts.fulfilled, (state,action)=>{
        console.log(action.payload);
        state.savedPosts = action.payload.savedPosts;
      })
      // .addCase()
  }
});


export const selectSavedPostById = (state, savedpostId) =>
  state.auth.savedPosts.find(post => post.id === savedpostId);


export const { logout } = authSlice.actions;
export default authSlice.reducer;
