import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from '../lib/apiRequest';
// import { sub } from 'date-fns';
import axios from "axios";



const initialState = {
    post: {},
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

export const fetchPostById = createAsyncThunk('post/fetchPostById', async (postId) => {
    const response = await apiRequest.get(`/post/${postId}`);
    console.log("response", response);
    return response.data;
  });

export const deletePost = createAsyncThunk('post/deletePost', async (postId) => {
    try {
        const response = await apiRequest.delete(`/post/${postId}`)
        return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
        return err.message;
    }
})

export const likePost = createAsyncThunk('post/like', async(postId)=> {
  const res = await apiRequest.post('/post/like', {postId});
  return res.data;
})

export const savePost = createAsyncThunk(
    'post/save',
    async ({ postId, saved }) => {
      await apiRequest.post('/user/save', { postId });
      console.log(saved, postId);
      return { postId, saved };
    }
  );
  

const singlepostSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        
        resetPost(state) {
            state.post = {};
            state.status = 'idle';
          },
      
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPostById.pending, (state) => {
                state.status = 'loading';
              })
            .addCase(fetchPostById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.post = action.payload;
              })
            .addCase(fetchPostById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
              })
            .addCase(updatePost.pending, (state) => {
                state.status = 'loading';
              })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.post = action.payload;
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
              })
            .addCase(likePost.fulfilled, (state, action) => {
              if (state.post.id === action.payload.postId) {
                state.post.likeCount = action.payload.likeCount;
              }
            })
            .addCase(savePost.fulfilled, (state, action) => {
                if (state.post.id === action.payload.id) {
                  state.post.isSaved = action.payload.saved;
                }
              });
            // .addCase(deletePost.fulfilled, (state, action) => {
            //     if (!action.payload?.id) {
            //         console.log('Delete could not complete')
            //         console.log(action.payload)
            //         return;
            //     }
            //     const { id } = action.payload;
            //     const posts = state.posts.filter(post => post.id !== id);
            //     state.posts = posts;
            // })
    }
})

export const selectPost = (state) => state.post.post;
export const getPostStatus = (state) => state.post.status;
export const getPostError = (state) => state.post.error;



// export const selectPostById = (state, postId) =>
//     state.posts.posts.find(post => post.id === postId);

export const { resetPost } = singlepostSlice.actions

export default singlepostSlice.reducer