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

export const savePost = createAsyncThunk(
    'post/save',
    async ({ postId, saved }) => {
      await apiRequest.post('/user/save', { postId });
      console.log(saved, postId);
      return { postId, saved };
    }
  );

export const likePost = createAsyncThunk('post/like', async({postId, liked})=> {
    const res = await apiRequest.post('/post/like', {postId});
    return {postId, liked};
})

export const addComment = createAsyncThunk('post/comment', async({postId, content})=>{
  const res = await apiRequest.post('post/comment', {content, postId});
  return res.data;
})

export const addRating = createAsyncThunk('post/rating', async({postId, rating})=>{
  const res = await apiRequest.post('post/rating', {rating, postId});
  return res.data;
})

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
                 
                  state.post.isLiked = action.payload.liked;
                }
            })
            .addCase(savePost.fulfilled, (state, action) => {
                if (state.post.id === action.payload.postId) {
                  state.post.isSaved = action.payload.saved;
                }
              })
            .addCase(addComment.fulfilled, (state, action)=> {
              if(state.post.id===action.payload.postId){
                // console.log(action.payload);
                state.post.comments.push(action.payload);
              }
            })
            .addCase(addRating.fulfilled, (state, action)=>{
              if(state.post.id===action.payload.postId){
                // console.log(action.payload);
                // console.log(JSON.stringify(state.post));
                // console.log(Object.getOwnPropertyDescriptors(state.post.ratings[0])); 
                //change karna h
                const newRating = action.payload;
                const existingRatingIndex = state.post.ratings.findIndex(
                  (rating) => rating.userId === newRating.userId && rating.postId === newRating.postId
                );
        
                if (existingRatingIndex === -1) {
                  // If no existing rating, push the new rating object to the array
                  state.post.ratings.push(newRating);
                } else {
                  // If rating exists, replace the existing object with the new one
                  state.post.ratings[existingRatingIndex] = newRating;
                }

                const sumofRatings = state.post.ratings.reduce((acc, rating)=> acc+rating.rating, 0);
                const avgrating = Math.round((sumofRatings/state.post.ratings.length)*10)/10;
                state.post.avgRating = avgrating;
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